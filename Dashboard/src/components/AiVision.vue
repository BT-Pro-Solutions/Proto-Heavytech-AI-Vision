<template>
  <div class="aivision">
    <Header>
      <template #title>
        EQUIPMENT NAME HERE
      </template>
      <template #subtitle>
        AI VISION - <span class="active-status">ACTIVE</span>
      </template>
    </Header>
    
    <div class="aivision-container">
      <!-- Left side - 3D Model -->
      <div class="model-container" :class="{ 'is-loaded': animationState.model }">
        <div class="model-viewport" ref="modelViewport">
          <!-- Three.js 3D model will be rendered here -->
        </div>
        

      </div>

      <!-- Right side - Data visualization -->
      <div class="data-container">
        <!-- Movement Visualization -->
        <div class="movement-section" :class="{ 'is-loaded': animationState.movement }">
          <h3 class="section-title">MOVEMENT VISUALIZATION</h3>
          
          <div class="movement-table">
            <div class="movement-row">
              <div class="movement-header">
                <div class="movement-label">TOOL TILT</div>
                <div class="movement-value">{{ Math.round(movements.toolTilt) }}°</div>
              </div>
              <div class="movement-bar interactive-bar" 
                   @mousedown="startDrag('toolTilt', $event)"
                   @touchstart="startDrag('toolTilt', $event)">
                <div class="movement-bar-fill" :style="{ width: `${((Math.round(movements.toolTilt) + 90) / 180) * 100}%` }"></div>
                <div class="movement-thumb" :style="{ left: `${((Math.round(movements.toolTilt) + 90) / 180) * 100}%` }"></div>
              </div>
            </div>

            <div class="movement-row">
              <div class="movement-header">
                <div class="movement-label">ARM TILT</div>
                <div class="movement-value">{{ Math.round(movements.armTilt) }}°</div>
              </div>
              <div class="movement-bar interactive-bar" 
                   @mousedown="startDrag('armTilt', $event)"
                   @touchstart="startDrag('armTilt', $event)">
                <div class="movement-bar-fill" :style="{ width: `${((Math.round(movements.armTilt) + 32) / 50) * 100}%` }"></div>
                <div class="movement-thumb" :style="{ left: `${((Math.round(movements.armTilt) + 32) / 50) * 100}%` }"></div>
              </div>
            </div>

            <div class="movement-row">
              <div class="movement-header">
                <div class="movement-label">ARM EXTENSION</div>
                <div class="movement-value">{{ Math.round(((movements.armExtension - 1) / 0.5) * 100) }}</div>
              </div>
              <div class="movement-bar interactive-bar" 
                   @mousedown="startDrag('armExtension', $event)"
                   @touchstart="startDrag('armExtension', $event)">
                <div class="movement-bar-fill" :style="{ width: `${((movements.armExtension - 1) / 0.5) * 100}%` }"></div>
                <div class="movement-thumb" :style="{ left: `${((movements.armExtension - 1) / 0.5) * 100}%` }"></div>
              </div>
            </div>

            <div class="movement-row">
              <div class="movement-header">
                <div class="movement-label">CENTER PIVOT</div>
                <div class="movement-value">{{ Math.round(movements.centerPivot) }}°</div>
              </div>
              <div class="movement-indicator interactive-bar" 
                   @mousedown="startDrag('centerPivot', $event)"
                   @touchstart="startDrag('centerPivot', $event)">
                <div class="pivot-dot" :style="{ left: `${50 + (Math.round(movements.centerPivot) / 45) * 50}%` }"></div>
              </div>
            </div>
          </div>
        </div>



        <!-- AI Vision Status -->
        <div class="vision-section" :class="{ 'is-loaded': animationState.video }">
          
          
          <!-- Video feed: show MJPEG stream only when active, otherwise fallback video -->
          <div class="video-container">
            <img v-if="cameraActive" class="video-feed" :src="cameraUrl" alt="Robot Camera Feed" />
            <video v-else class="video-feed" autoplay muted loop>
              <source src="/loader.mp4" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          <div class="vision-header">
            <div class="vision-status">
              <div class="status-dot active"></div>
              <span>AI VISION</span>
            </div>
            <div class="vision-stats">
              {{ hasLiveData ? visionStats.fps : 60 }} FPS | {{ hasLiveData ? (trainingActive ? 'Training Active' : 'Live') : visionStats.status }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import Header from './Header.vue'

// Three.js variables
let scene, camera, renderer, model, mixer
let composer, bloomPass
let groundMesh
let groundGrid
let modelBaseYaw = 0
let modelParts = {} // Store references to model parts
const modelViewport = ref(null)

// Sample movement data - now controlled by sliders
const movements = ref({
  toolTilt: -55,
  armTilt: 140,
  armExtension: 1,
  centerPivot: 0,
  // Wheel RPM values (-100 to 100)
  wheelBackLeft: 0,
  wheelBackRight: 0,
  wheelFrontLeft: 0,
  wheelFrontRight: 0
})

// Target values for smooth animation
const targetMovements = ref({
  toolTilt: -55,
  armTilt: 140,
  armExtension: 1,
  centerPivot: 0,
  // Wheel RPM targets
  wheelBackLeft: 0,
  wheelBackRight: 0,
  wheelFrontLeft: 0,
  wheelFrontRight: 0
})

// Vision system and live-data flags
const visionStats = ref({
  fps: 60,
  status: 'Idle'
})
const hasLiveData = ref(false)
const trainingActive = ref(false)
const cameraActive = ref(false)
const cameraUrl = ref('http://heavy.local:8000/camera/stream')
const lightsOn = ref(false)

// Animation intervals
let animationInterval = null
let animationId = null
let isManualControl = ref(false)
let manualControlTimeout = null
let websocket = null
let reconnectTimer = null
let messagesThisSecond = 0
let fpsInterval = null
let wheelDirection = 0 // -1 backward, 0 stopped, 1 forward
let motorSpeed = 0 // 0.0 - 1.0

// Animation state for fade-in effects
const animationState = ref({
  model: false,
  movement: false,
  video: false
})

// Mouse controls state
let isDragging = false
let previousMouseX = 0
let previousMouseY = 0
let cameraAngleX = 0
let cameraAngleY = 0

// Drag state for movement bars
let isDraggingBar = false
let dragProperty = null
let dragTarget = null

// Mouse event handlers
const onMouseDown = (event) => {
  isDragging = true
  previousMouseX = event.clientX
  previousMouseY = event.clientY
  if (modelViewport.value) {
    modelViewport.value.style.cursor = 'grabbing'
  }
}

const onMouseMove = (event) => {
  if (!isDragging) return
  
  const deltaX = event.clientX - previousMouseX
  const deltaY = event.clientY - previousMouseY
  
  cameraAngleX += deltaX * 0.01
  cameraAngleY += deltaY * 0.01
  
  // Limit vertical rotation
  cameraAngleY = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraAngleY))
  
  previousMouseX = event.clientX
  previousMouseY = event.clientY
}

const onMouseUp = () => {
  isDragging = false
  if (modelViewport.value) {
    modelViewport.value.style.cursor = 'grab'
  }
}

// Initialize Three.js scene
const initThreeJS = () => {
  if (!modelViewport.value) return

  // Scene setup
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0f151a) // Set background to #0f151a

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    modelViewport.value.clientWidth / modelViewport.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(19, 19, 19) // Zoom out more

  // Renderer setup with improved quality
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: false, // Changed to false since we have a solid background
    powerPreference: "high-performance"
  })
  renderer.setSize(modelViewport.value.clientWidth, modelViewport.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.outputColorSpace = THREE.SRGBColorSpace
  modelViewport.value.appendChild(renderer.domElement)

  // Setup bloom effect
  composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)
  
  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(modelViewport.value.clientWidth, modelViewport.value.clientHeight),
    0.5, // Bloom strength
    0.4, // Bloom radius
    0.85  // Bloom threshold
  )
  composer.addPass(bloomPass)

  // Enhanced lighting setup
  const ambientLight = new THREE.AmbientLight(0x404040, 8)
  scene.add(ambientLight)

  // Primary directional light (key light)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
  directionalLight.position.set(10, 10, 5)
  directionalLight.castShadow = true
  
  // High quality shadow properties
  directionalLight.shadow.mapSize.width = 4096
  directionalLight.shadow.mapSize.height = 4096
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 500
  directionalLight.shadow.camera.left = -50
  directionalLight.shadow.camera.right = 50
  directionalLight.shadow.camera.top = 50
  directionalLight.shadow.camera.bottom = -50
  directionalLight.shadow.radius = 4
  directionalLight.shadow.blurSamples = 25
  
  scene.add(directionalLight)

  // Secondary directional light (fill light)
  const fillLight = new THREE.DirectionalLight(0x8080ff, 0.8)
  fillLight.position.set(-5, 5, -5)
  scene.add(fillLight)

  // Rim light for better edge definition
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.6)
  rimLight.position.set(0, 10, -10)
  scene.add(rimLight)

  // Hemisphere light for better overall illumination
  const hemisphereLight = new THREE.HemisphereLight(0x8080ff, 0x404040, 0.5)
  scene.add(hemisphereLight)

  // Add transparent ground plane for shadows
  const groundGeometry = new THREE.PlaneGeometry(100, 100)
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 })
  groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
  groundMesh.rotation.x = -Math.PI / 2
  groundMesh.position.y = -5
  groundMesh.receiveShadow = true
  scene.add(groundMesh)

  // Subtle ground lines (grid) to indicate motion; only shown when moving
  groundGrid = new THREE.GridHelper(1000, 200, 0x406080, 0x406080)
  groundGrid.position.y = -4.95
  if (Array.isArray(groundGrid.material)) {
    groundGrid.material.forEach((m) => { m.transparent = true; m.opacity = 0.25; m.depthWrite = false })
  } else if (groundGrid.material) {
    groundGrid.material.transparent = true
    groundGrid.material.opacity = 0.25
    groundGrid.material.depthWrite = false
  }
  groundGrid.visible = false
  scene.add(groundGrid)

  // Load GLB model
  const loader = new GLTFLoader()
  loader.load('/model-bucket.glb', (gltf) => {
    model = gltf.scene
    // Increase overall model size by an additional 1.2x
    model.scale.set(28.8, 28.8, 28.8)
    model.rotation.y = Math.PI / 6 
    modelBaseYaw = model.rotation.y
    scene.add(model)

    // Find and store model parts with material improvements
    model.traverse((child) => {
      if (child.isMesh) {
        // Enable shadows
        child.castShadow = true
        child.receiveShadow = true
        
        // Improve material quality
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.needsUpdate = true
              if (mat.map) mat.map.generateMipmaps = true
            })
          } else {
            child.material.needsUpdate = true
            if (child.material.map) child.material.map.generateMipmaps = true
          }
        }
        
        const name = child.name.toLowerCase()
        if (name.includes('tool')) {
          modelParts.fork = child
        } else if (name.includes('arm-extension')) {
          modelParts.armExtension = child
        } else if (name.includes('arm')) {
          modelParts.arm = child
        } else if (name.includes('front-pivot')) {
          modelParts.frontPivot = child
        } else if (name.includes('light-bar-lights')) {
          modelParts.lightBarLights = child
        } else if (name.includes('front-lights')) {
          modelParts.frontLights = child
        } else if (name.includes('wheel-back-left') || name.includes('wheel_back_left')) {
          modelParts.wheelBackLeft = child
        } else if (name.includes('wheel-back-right') || name.includes('wheel_back_right')) {
          modelParts.wheelBackRight = child
        } else if (name.includes('wheel-front-left') || name.includes('wheel_front_left')) {
          modelParts.wheelFrontLeft = child
        } else if (name.includes('wheel-front-right') || name.includes('wheel_front_right')) {
          modelParts.wheelFrontRight = child
        }
      }
    })

    console.log('Found model parts:', Object.keys(modelParts))

    // Setup animation mixer if animations exist
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model)
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play()
      })
    }

    // Center the model
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    model.position.sub(center);
    model.position.z += -5;

    // Fit ground plane just beneath the model's lowest point to avoid intersection
    const fittedBox = new THREE.Box3().setFromObject(model)
    const minY = fittedBox.min.y
    const newGroundY = minY - 0.05
    if (groundMesh) {
      groundMesh.position.y = newGroundY
    }
    if (groundGrid) {
      groundGrid.position.y = newGroundY + 0.02 // slightly above plane to prevent z-fighting
    }
  })

  // Setup event listeners
  if (modelViewport.value) {
    modelViewport.value.addEventListener('mousedown', onMouseDown)
    modelViewport.value.style.cursor = 'grab'
  }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)

  // Animation loop
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    // Smooth interpolation for movement values
    smoothInterpolation()

    // Update mixer
    if (mixer) {
      mixer.update(0.016)
    }

    // Update camera position based on drag
    if (model) {
      const radius = 20  // Increased from 15 to zoom out more
      camera.position.x = Math.cos(cameraAngleX) * Math.cos(cameraAngleY) * radius
      camera.position.y = Math.sin(cameraAngleY) * radius + 5
      camera.position.z = Math.sin(cameraAngleX) * Math.cos(cameraAngleY) * radius
      camera.lookAt(0, 0, 0)
    }

  // Update model parts based on movement data
    if (modelParts.fork) {
      // Bucket angle is relative to horizontal; convert to local rotation by subtracting arm tilt
      // Then apply model orientation bias of -100°
      const localBucketDeg = (movements.value.toolTilt - movements.value.armTilt) - 100
      modelParts.fork.rotation.x = THREE.MathUtils.degToRad(-localBucketDeg)
    }
    if (modelParts.arm) {
      modelParts.arm.rotation.x = THREE.MathUtils.degToRad(-movements.value.armTilt)
    }
    if (modelParts.armExtension) {
      // Reduce visual extension by half: baseline 1 + half the delta
      const reducedExtension = 1 + (movements.value.armExtension - 1) * 0.5
      modelParts.armExtension.scale.z = reducedExtension
    }
    if (modelParts.frontPivot) {
      modelParts.frontPivot.rotation.y = THREE.MathUtils.degToRad(-movements.value.centerPivot)
    }
    // Toggle visible lights based on websocket lights flag
    if (modelParts.lightBarLights) {
      modelParts.lightBarLights.visible = !!lightsOn.value
    }
    if (modelParts.frontLights) {
      modelParts.frontLights.visible = !!lightsOn.value
    }
    
    // Wheel rotation: when live, rotate only by motor direction (forward/back/stopped).
    // When offline, fall back to simulated RPM-based rotation.
    const rpmToRadiansPerFrame = (rpm) => (rpm * 2 * Math.PI) / 3600
    const liveWheelDelta = hasLiveData.value ? wheelDirection * 0.05 : null // radians per frame
    
    if (modelParts.wheelBackLeft) {
      modelParts.wheelBackLeft.rotation.x += (liveWheelDelta ?? rpmToRadiansPerFrame(movements.value.wheelBackLeft))
    }
    if (modelParts.wheelBackRight) {
      modelParts.wheelBackRight.rotation.x += (liveWheelDelta ?? rpmToRadiansPerFrame(movements.value.wheelBackRight))
    }
    if (modelParts.wheelFrontLeft) {
      modelParts.wheelFrontLeft.rotation.x += (liveWheelDelta ?? rpmToRadiansPerFrame(movements.value.wheelFrontLeft))
    }
    if (modelParts.wheelFrontRight) {
      modelParts.wheelFrontRight.rotation.x += (liveWheelDelta ?? rpmToRadiansPerFrame(movements.value.wheelFrontRight))
    }

    // Animate ground lines to simulate motion beneath robot (without moving robot)
    if (groundGrid) {
      const steerRad = THREE.MathUtils.degToRad(movements.value.centerPivot || 0)
      // Compose heading from base model yaw, steering, and camera orbit to match visual facing
      const headingYaw = (modelBaseYaw || 0) - cameraAngleX - steerRad
      // Always show and orient grid to match bot heading as seen on screen
      groundGrid.visible = true
      groundGrid.rotation.y = headingYaw
      // Move grid under bot only when moving
      const isMoving = hasLiveData.value && wheelDirection !== 0 && motorSpeed > 0.01
      if (isMoving) {
        const forward = new THREE.Vector3(0, 0, -1)
        forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), headingYaw)
        const scalar = wheelDirection * motorSpeed * 0.5 // tune ground flow speed
        groundGrid.position.x += forward.x * scalar
        groundGrid.position.z += forward.z * scalar
        // Recenter if drifting too far
        if (Math.abs(groundGrid.position.x) > 50 || Math.abs(groundGrid.position.z) > 50) {
          groundGrid.position.x = 0
          groundGrid.position.z = 0
        }
      }
    }

    composer.render()
  }
  animate()

  // Handle resize
  const handleResize = () => {
    if (modelViewport.value) {
      camera.aspect = modelViewport.value.clientWidth / modelViewport.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(modelViewport.value.clientWidth, modelViewport.value.clientHeight)
      composer.setSize(modelViewport.value.clientWidth, modelViewport.value.clientHeight)
    }
  }
  window.addEventListener('resize', handleResize)
}

// Simulate movement data when no live data is available
const simulateMovements = () => {
  if (hasLiveData.value) {
    return
  }
  if (!isManualControl.value) {
    // Update target values for smooth animation
    targetMovements.value.toolTilt = 90 + Math.sin(Date.now() * 0.001) * 20  // Range: -75 to -35
    targetMovements.value.armTilt = 0 + Math.cos(Date.now() * 0.0008) * 30   // Range: 155 to 215
    targetMovements.value.armExtension = 1.25 + Math.cos(Date.now() * 0.0012) * 0.15  // Range: 1.1 to 1.4
    targetMovements.value.centerPivot = Math.sin(Date.now() * 0.0005) * 25     // Range: -25 to 25
    
    // Simulate wheel RPM values (-100 to 100)
    const time = Date.now() * 0.001
    targetMovements.value.wheelBackLeft = Math.sin(time * 0.7) * 60 + Math.cos(time * 0.3) * 40
    targetMovements.value.wheelBackRight = Math.sin(time * 0.7) * 60 + Math.cos(time * 0.3) * 40
    targetMovements.value.wheelFrontLeft = Math.sin(time * 0.5) * 50 + Math.cos(time * 0.4) * 30
    targetMovements.value.wheelFrontRight = Math.sin(time * 0.5) * 50 + Math.cos(time * 0.4) * 30
  }
  
  // Simulated FPS when offline
  visionStats.value.fps = 60
}

// Smooth interpolation function
const smoothInterpolation = () => {
  const lerpFactor = isManualControl.value ? 0.15 : 0.05 // Faster interpolation for manual control
  
  // Linear interpolation towards target values
  movements.value.toolTilt += (targetMovements.value.toolTilt - movements.value.toolTilt) * lerpFactor
  movements.value.armTilt += (targetMovements.value.armTilt - movements.value.armTilt) * lerpFactor
  movements.value.armExtension += (targetMovements.value.armExtension - movements.value.armExtension) * lerpFactor
  movements.value.centerPivot += (targetMovements.value.centerPivot - movements.value.centerPivot) * lerpFactor
  
  // Interpolate wheel RPM values
  movements.value.wheelBackLeft += (targetMovements.value.wheelBackLeft - movements.value.wheelBackLeft) * lerpFactor
  movements.value.wheelBackRight += (targetMovements.value.wheelBackRight - movements.value.wheelBackRight) * lerpFactor
  movements.value.wheelFrontLeft += (targetMovements.value.wheelFrontLeft - movements.value.wheelFrontLeft) * lerpFactor
  movements.value.wheelFrontRight += (targetMovements.value.wheelFrontRight - movements.value.wheelFrontRight) * lerpFactor
}

// Handle manual control interaction
const onManualControlStart = () => {
  isManualControl.value = true
  // Clear any existing timeout
  if (manualControlTimeout) {
    clearTimeout(manualControlTimeout)
  }
}

const onManualControlEnd = () => {
  // Clear any existing timeout
  if (manualControlTimeout) {
    clearTimeout(manualControlTimeout)
  }
  
  // Set new timeout
  manualControlTimeout = setTimeout(() => {
    isManualControl.value = false
    manualControlTimeout = null
  }, 10000) // Resume automation after 10 seconds of no interaction
}

// Handle drag start for movement bars
const startDrag = (property, event) => {
  isDraggingBar = true
  dragProperty = property
  dragTarget = event.currentTarget
  onManualControlStart()
  updateDragValue(event)
  event.preventDefault()
}

// Handle drag movement
const onDragMove = (event) => {
  if (isDraggingBar && dragProperty && dragTarget) {
    event.preventDefault()
    updateDragValue(event)
  }
}

// Handle drag end
const onDragEnd = () => {
  if (isDraggingBar) {
    isDraggingBar = false
    dragProperty = null
    dragTarget = null
    onManualControlEnd()
  }
}

// Update value based on drag position
const updateDragValue = (event) => {
  const rect = (dragTarget || event.currentTarget).getBoundingClientRect()
  const clientX = event.clientX || (event.touches && event.touches[0].clientX)
  const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  
  let value
  switch (dragProperty) {
    case 'toolTilt':
      value = -90 + (percent * 180) // -90 to 90
      break
    case 'armTilt':
      value = 140 + (percent * 90) // 140 to 230
      break
    case 'armExtension':
      value = 1 + (percent * 0.5) // 1 to 1.5
      break
    case 'centerPivot':
      value = -45 + (percent * 90) // -45 to 45
      break
  }
  
  if (value !== undefined) {
    movements.value[dragProperty] = value
    targetMovements.value[dragProperty] = value
  }
}

// Animation sequence
const startAnimationSequence = () => {
  // Model slides in from left
  setTimeout(() => {
    animationState.value.model = true
  }, 200)
  
  // Movement panel fades in
  setTimeout(() => {
    animationState.value.movement = true
  }, 700)
  
  // Video feed fades in
  setTimeout(() => {
    animationState.value.video = true
  }, 1200)
}

onMounted(() => {
  // Initialize Three.js
  initThreeJS()
  
  // Start movement simulation
  animationInterval = setInterval(simulateMovements, 100)
  
  // Start FPS measurement for live data
  fpsInterval = setInterval(() => {
    if (hasLiveData.value) {
      visionStats.value.fps = messagesThisSecond
    }
    messagesThisSecond = 0
  }, 1000)

  // Connect to robot websocket for live data
  connectWebsocket()

  // Add drag event listeners
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchmove', onDragMove)
  window.addEventListener('touchend', onDragEnd)
  
  // Start animation sequence
  startAnimationSequence()
})

onUnmounted(() => {
  // Clean up intervals
  if (animationInterval) {
    clearInterval(animationInterval)
  }
  
  // Clean up timeouts
  if (manualControlTimeout) {
    clearTimeout(manualControlTimeout)
  }
  
  // Clean up Three.js
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (composer) {
    composer.dispose()
  }
  if (renderer) {
    renderer.dispose()
  }
  groundGrid = null
  
  // Clean up event listeners
  if (typeof onMouseMove === 'function') {
    window.removeEventListener('mousemove', onMouseMove)
  }
  if (typeof onMouseUp === 'function') {
    window.removeEventListener('mouseup', onMouseUp)
  }
  if (modelViewport.value && typeof onMouseDown === 'function') {
    modelViewport.value.removeEventListener('mousedown', onMouseDown)
  }
  
  // Clean up drag event listeners
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchmove', onDragMove)
  window.removeEventListener('touchend', onDragEnd)

  if (websocket) {
    try { websocket.close() } catch (e) {}
    websocket = null
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (fpsInterval) {
    clearInterval(fpsInterval)
    fpsInterval = null
  }
})

// Map robot extension in mm (0-100) to model scale (1.0 - 1.5)
const mapExtensionToScale = (millimeters) => {
  const mm = Math.max(0, Math.min(100, Number(millimeters) || 0))
  return 1 + (mm / 100) * 0.5
}

// Establish websocket and update reactive targets
const connectWebsocket = () => {
  try {
    websocket = new WebSocket('ws://heavy.local:8000/ws')
  } catch (e) {
    scheduleReconnect()
    return
  }

  websocket.onopen = () => {
    // Connected; wait for messages to mark live
  }

  websocket.onmessage = (event) => {
    messagesThisSecond += 1
    let data
    try {
      data = JSON.parse(event.data)
    } catch (e) {
      return
    }

    // We have live data
    hasLiveData.value = true

    // Update training/camera/lights status
    trainingActive.value = !!data.training_mode_active
    const camActive = !!data.camera_stream_active
    cameraActive.value = camActive
    if (typeof data.lights_on === 'boolean') {
      lightsOn.value = data.lights_on
    }
    if (typeof data.camera_url === 'string' && data.camera_url.length > 0) {
      cameraUrl.value = data.camera_url.startsWith('http')
        ? data.camera_url
        : `http://heavy.local:8000${data.camera_url}`
    } else {
      cameraUrl.value = 'http://heavy.local:8000/camera/stream'
    }

    // Update target movements from live data
    if (!isManualControl.value) {
      if (typeof data.bucket_angle === 'number') {
        targetMovements.value.toolTilt = data.bucket_angle
      }
      if (typeof data.arm_angle === 'number') {
        targetMovements.value.armTilt = data.arm_angle
      }
      if (typeof data.extension_amount === 'number') {
        targetMovements.value.armExtension = mapExtensionToScale(data.extension_amount)
      }
      if (typeof data.servo_angle === 'number') {
        targetMovements.value.centerPivot = data.servo_angle
      }
    }

    // Update wheel direction from motor state
    if (typeof data.motor_direction === 'string') {
      const dir = data.motor_direction.toLowerCase()
      wheelDirection = dir === 'forward' ? 1 : dir === 'backward' ? -1 : 0
    }
    if (typeof data.motor_speed === 'number') {
      motorSpeed = Math.max(0, Math.min(1, data.motor_speed))
    }
  }

  websocket.onclose = () => {
    hasLiveData.value = false
    cameraActive.value = false
    lightsOn.value = false
    wheelDirection = 0
    scheduleReconnect()
  }

  websocket.onerror = () => {
    try { websocket.close() } catch (e) {}
  }
}

const scheduleReconnect = () => {
  if (reconnectTimer) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    connectWebsocket()
  }, 2000)
}
</script>

<style scoped>
.aivision {
  height: 100%;
  width: 100%;
  overflow: auto;
  padding-right: 2rem;
}

.active-status {
  color: var(--color-primary);
}

.aivision-container {
  display: flex;
  gap: 2rem;
  width: 100%;
  height: calc(100% - 125px);
}

.model-container {
  flex: 1;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateX(-100px);
  transition: opacity 0.8s ease, transform 0.8s ease;

  &.is-loaded {
    opacity: 1;
    transform: translateX(0);
  }

  &::before {
    content: '';
    background: #0f151a;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.model-viewport {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  position: relative;
}

.data-container {
  flex: 0 0 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 25px);
}

.movement-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;

  &.is-loaded {
    opacity: 1;
    transform: translateY(0);
  }
}



.section-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 2rem;
  letter-spacing: 0.5px;
}

.movement-table {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.movement-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.movement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.movement-label {
  font-family: var(--font-body);
  font-weight: 600;
  color: var(--color-secondary);
  font-size: 0.9rem;
  text-align: left;
}

.movement-value {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  color: #fff;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.movement-bar {
  flex: 1;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  position: relative;
}

.interactive-bar {
  cursor: pointer;
  
  &:hover .movement-thumb {
    opacity: 1;
  }
}

.movement-thumb {
  position: absolute;
  top: -4px;
  width: 16px;
  height: 16px;
  background: var(--color-secondary);
  border-radius: 50%;
  transform: translateX(-50%);
  transition: opacity 0.2s ease, left 0.3s ease;
  opacity: 0;
  box-shadow: 0 0 8px var(--color-secondary-transparent);
}

.movement-bar-fill {
  height: 100%;
  background: var(--color-secondary);
  border-radius: 6px;
  transition: width 0.3s ease;
  box-shadow: 0 0 8px var(--color-secondary-transparent);
  height: 6px;
}

.movement-indicator {
  flex: 1;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  position: relative;
  min-height: 6px;
}

.pivot-dot {
  width: 16px;
  height: 6px;
  background: var(--color-secondary);
  border-radius: 2px;
  position: absolute;
  top: 0px;
  transform: translateX(-50%);
  transition: left 0.3s ease;
}



.vision-section {
  border-radius: 8px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;

  &.is-loaded {
    opacity: 1;
    transform: translateY(0);
  }
}

.vision-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.vision-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-weight: 600;
  color: #fff;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 8px var(--color-primary-transparent);
  animation: pulse 2s infinite;
}

.vision-stats {
  font-family: var(--font-body);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.video-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(62, 222, 99, 0.3);
}

.video-feed {
  width: 100%;
  height: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  background: linear-gradient(45deg, #2a2a3e 0%, #1a1a2e 100%);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Scrollbar styling */
.aivision::-webkit-scrollbar {
  display: none;
}
</style> 