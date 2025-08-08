<template>
  <div class="aivision">
    <Header @power-toggle="onPowerToggle">
      <template #title>
        AI VISION - <span :class="isIdleStatus ? 'idle-status' : 'active-status'">{{ isIdleStatus ? 'IDLE' : 'ACTIVE' }}</span>
      </template>
      <template #subtitle>
        HEAVYTECH WHEEL LOADER
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
<br></br>
           <h3 class="section-title">FLOW RATE</h3>
          
          <div class="pressure-dials">
            <div class="pressure-dial">
              <div class="dial-container">
                <svg class="dial-svg" viewBox="0 0 50 50">
                  <circle class="dial-background" cx="25" cy="25" r="20" />
                   <circle class="dial-fill" cx="25" cy="25" r="20" 
                           :style="{ strokeDasharray: dialDash(fluidPressures.driveMotors) }" />
                  <text class="dial-value-text" x="25" y="24" text-anchor="middle" dominant-baseline="middle">{{ Math.round(fluidPressures.driveMotors) }}</text>
                </svg>
                <div class="dial-title">DRIVE</div>
              </div>
            </div>

            <div class="pressure-dial">
              <div class="dial-container">
                <svg class="dial-svg" viewBox="0 0 50 50">
                  <circle class="dial-background" cx="25" cy="25" r="20" />
                   <circle class="dial-fill" cx="25" cy="25" r="20" 
                           :style="{ strokeDasharray: dialDash(fluidPressures.steeringMotor) }" />
                  <text class="dial-value-text" x="25" y="24" text-anchor="middle" dominant-baseline="middle">{{ Math.round(fluidPressures.steeringMotor) }}</text>
                </svg>
                <div class="dial-title">STEER</div>
              </div>
            </div>

            <div class="pressure-dial">
              <div class="dial-container">
                <svg class="dial-svg" viewBox="0 0 50 50">
                  <circle class="dial-background" cx="25" cy="25" r="20" />
                   <circle class="dial-fill" cx="25" cy="25" r="20" 
                           :style="{ strokeDasharray: dialDash(fluidPressures.bucketMotor) }" />
                  <text class="dial-value-text" x="25" y="24" text-anchor="middle" dominant-baseline="middle">{{ Math.round(fluidPressures.bucketMotor) }}</text>
                </svg>
                <div class="dial-title">BUCKET</div>
              </div>
            </div>

            <div class="pressure-dial">
              <div class="dial-container">
                <svg class="dial-svg" viewBox="0 0 50 50">
                  <circle class="dial-background" cx="25" cy="25" r="20" />
                   <circle class="dial-fill" cx="25" cy="25" r="20" 
                           :style="{ strokeDasharray: dialDash(fluidPressures.armMotor) }" />
                  <text class="dial-value-text" x="25" y="24" text-anchor="middle" dominant-baseline="middle">{{ Math.round(fluidPressures.armMotor) }}</text>
                </svg>
                <div class="dial-title">ARM</div>
              </div>
            </div>

            <div class="pressure-dial">
              <div class="dial-container">
                <svg class="dial-svg" viewBox="0 0 50 50">
                  <circle class="dial-background" cx="25" cy="25" r="20" />
                   <circle class="dial-fill" cx="25" cy="25" r="20" 
                           :style="{ strokeDasharray: dialDash(fluidPressures.extensionMotor) }" />
                  <text class="dial-value-text" x="25" y="24" text-anchor="middle" dominant-baseline="middle">{{ Math.round(fluidPressures.extensionMotor) }}</text>
                </svg>
                <div class="dial-title">EXT</div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Vision Status -->
        <div class="vision-section" :class="{ 'is-loaded': animationState.video }">
          
          
          <!-- Video feed: show MJPEG stream only when active, otherwise fallback video -->
          <div class="video-container">
            <img class="video-feed" :src="cameraUrl" alt="Robot Camera Feed" />
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
let lightMaterials = {} // Store original and dull materials for lights
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
const powerEnabled = ref(true)
// App base path for serving public assets both in dev and prod
const appBase = (import.meta && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/'

// Fluid pressure data (flow rates from API)
const fluidPressures = ref({
  driveMotors: 0,
  steeringMotor: 0,
  bucketMotor: 0,
  armMotor: 0,
  extensionMotor: 0
})

// Target fluid pressures for smooth animation
const targetFluidPressures = ref({
  driveMotors: 0,
  steeringMotor: 0,
  bucketMotor: 0,
  armMotor: 0,
  extensionMotor: 0
})

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
// Offline playback state (for training_data fallback)
let offlineRows = []
let offlineIndex = 0
let offlineTimeout = null
const offlineActive = ref(false)

// UI idle indicator: when power is off or mock is playing
const isIdleStatus = computed(() => !powerEnabled.value || offlineActive.value)

// Animation state for fade-in effects
const animationState = ref({
  model: false,
  movement: false,
  video: false,
  fluidPressure: false
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
  scene.background = new THREE.Color(0x21262e) // Set background to #0f151a
  
  // Add fog effect for depth and atmosphere
  scene.fog = new THREE.Fog(0x21262e, 15, 100) // Same color as background, starts at 15 units, fully foggy at 100 units

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
    0.2, // Bloom strength
    0.6, // Bloom radius
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
  // Brighter color: use 0x70a0e0 (was 0x406080)
  groundGrid = new THREE.GridHelper(1000, 200, 0x70a0e0, 0x70a0e0)
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
          console.log('Found light-bar-lights:', child.name, child.material)
          // Store original material and create dull version
          if (child.material) {
            const originalMaterial = Array.isArray(child.material) ? child.material[0] : child.material
            const dullMaterial = originalMaterial.clone()
            dullMaterial.emissive = new THREE.Color(0x949292) // Brighter gray
            dullMaterial.emissiveIntensity = 0.3
            lightMaterials.lightBarLights = {
              original: originalMaterial,
              dull: dullMaterial
            }
            console.log('Created light materials for light-bar-lights')
          }
        } else if (name.includes('front-lights')) {
          modelParts.frontLights = child
          console.log('Found front-lights:', child.name, child.material)
          // Store original material and create dull version
          if (child.material) {
            const originalMaterial = Array.isArray(child.material) ? child.material[0] : child.material
            const dullMaterial = originalMaterial.clone()
            dullMaterial.emissive = new THREE.Color(0x949292) // Brighter gray
            dullMaterial.emissiveIntensity = 0.3
            lightMaterials.frontLights = {
              original: originalMaterial,
              dull: dullMaterial
            }
            console.log('Created light materials for front-lights')
          }
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
    // Switch light materials based on websocket lights flag
    if (modelParts.lightBarLights && lightMaterials.lightBarLights) {
      // Ensure lights are always visible
      modelParts.lightBarLights.visible = true
      
      const targetMaterial = lightsOn.value ? lightMaterials.lightBarLights.original : lightMaterials.lightBarLights.dull
      console.log('Switching light-bar-lights material:', lightsOn.value ? 'ON' : 'OFF')
      if (Array.isArray(modelParts.lightBarLights.material)) {
        modelParts.lightBarLights.material[0] = targetMaterial
        modelParts.lightBarLights.material[0].needsUpdate = true
      } else {
        modelParts.lightBarLights.material = targetMaterial
        modelParts.lightBarLights.material.needsUpdate = true
      }
    }
    if (modelParts.frontLights && lightMaterials.frontLights) {
      // Ensure lights are always visible
      modelParts.frontLights.visible = true
      
      const targetMaterial = lightsOn.value ? lightMaterials.frontLights.original : lightMaterials.frontLights.dull
      console.log('Switching front-lights material:', lightsOn.value ? 'ON' : 'OFF')
      if (Array.isArray(modelParts.frontLights.material)) {
        modelParts.frontLights.material[0] = targetMaterial
        modelParts.frontLights.material[0].needsUpdate = true
      } else {
        modelParts.frontLights.material = targetMaterial
        modelParts.frontLights.material.needsUpdate = true
      }
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
    
    // Simulate fluid pressure values (0-100)
    targetFluidPressures.value.driveMotors = 20 + Math.sin(time * 0.8) * 15 + Math.cos(time * 0.4) * 10
    targetFluidPressures.value.steeringMotor = 15 + Math.sin(time * 0.6) * 10 + Math.cos(time * 0.3) * 8
    targetFluidPressures.value.bucketMotor = 25 + Math.sin(time * 0.9) * 20 + Math.cos(time * 0.5) * 12
    targetFluidPressures.value.armMotor = 30 + Math.sin(time * 0.7) * 18 + Math.cos(time * 0.4) * 15
    targetFluidPressures.value.extensionMotor = 18 + Math.sin(time * 0.5) * 12 + Math.cos(time * 0.2) * 8
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
  
  // Interpolate fluid pressure values
  fluidPressures.value.driveMotors += (targetFluidPressures.value.driveMotors - fluidPressures.value.driveMotors) * lerpFactor
  fluidPressures.value.steeringMotor += (targetFluidPressures.value.steeringMotor - fluidPressures.value.steeringMotor) * lerpFactor
  fluidPressures.value.bucketMotor += (targetFluidPressures.value.bucketMotor - fluidPressures.value.bucketMotor) * lerpFactor
  fluidPressures.value.armMotor += (targetFluidPressures.value.armMotor - fluidPressures.value.armMotor) * lerpFactor
  fluidPressures.value.extensionMotor += (targetFluidPressures.value.extensionMotor - fluidPressures.value.extensionMotor) * lerpFactor
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
  
  // Fluid pressure panel fades in
  setTimeout(() => {
    animationState.value.fluidPressure = true
  }, 950)
  
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

  // Connect to robot websocket for live data (only when powered)
  if (powerEnabled.value) {
    connectWebsocket()
  }
  // If no live data within a short window or power is off, start offline playback
  setTimeout(() => {
    if (!hasLiveData.value || !powerEnabled.value) {
      startOfflinePlayback()
    }
  }, 1200)

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
  stopOfflinePlayback()
  
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

// Core handler to process incoming data (live or offline)
const handleIncomingData = (data, isOffline = false) => {
  // If websocket indicates idle, treat as offline regardless of power state
  if (!isOffline && data && data.idle === true) {
    startOfflinePlayback()
    return
  }
  // We have data (treat as live for UI/animation purposes)
  hasLiveData.value = true

  // Update training/camera/lights status
  trainingActive.value = !!data.training_mode_active
  const camActive = !!data.camera_stream_active
  cameraActive.value = camActive
  if (typeof data.lights_on === 'boolean') {
    lightsOn.value = data.lights_on
  }
  if (typeof data.camera_url === 'string' && data.camera_url.length > 0) {
    const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : ''
    if (data.camera_url.startsWith('http')) {
      cameraUrl.value = data.camera_url
    } else if (isOffline) {
      // Mock assets: resolve against app base (works on dev server and deployed server)
      const base = appBase.endsWith('/') ? appBase : `${appBase}/`
      cameraUrl.value = `${origin}${base.replace(/\/$/, '')}${data.camera_url}`
    } else {
      // Live stream served from robot
      cameraUrl.value = `http://heavy.local:8000${data.camera_url}`
    }
  }

  // Update target movements from data
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
    // Update fluid pressures (map flow rates to 0-100% of 25, hide under 1)
    if (data) {
      const flowToPercent = (v) => {
        const val = Number(v)
        if (!Number.isFinite(val)) return 0
        if (val < 1) return 0
        const pct = (val / 25) * 100
        return Math.max(0, Math.min(100, pct))
      }
      if (data.drive_motors_flow !== undefined) {
        targetFluidPressures.value.driveMotors = flowToPercent(data.drive_motors_flow)
      }
      if (data.steering_motor_flow !== undefined) {
        targetFluidPressures.value.steeringMotor = flowToPercent(data.steering_motor_flow)
      }
      if (data.bucket_motor_flow !== undefined) {
        targetFluidPressures.value.bucketMotor = flowToPercent(data.bucket_motor_flow)
      }
      if (data.arm_motor_flow !== undefined) {
        targetFluidPressures.value.armMotor = flowToPercent(data.arm_motor_flow)
      }
      if (data.extension_motor_flow !== undefined) {
        targetFluidPressures.value.extensionMotor = flowToPercent(data.extension_motor_flow)
      }
    }
  }

  // Update wheel direction and speed from motor state
  if (typeof data.motor_direction === 'string') {
    const dir = data.motor_direction.toLowerCase()
    wheelDirection = dir === 'forward' ? 1 : dir === 'backward' ? -1 : 0
  }
  if (typeof data.motor_speed === 'number') {
    motorSpeed = Math.max(0, Math.min(1, data.motor_speed))
  }

  // FPS counter tick
  messagesThisSecond += 1
}

  // Dial strokeDash helper: returns "len, total" string with visibility rule
  const dialDash = (percentVal) => {
    const total = 126
    const p = Math.max(0, Math.min(100, Number(percentVal) || 0))
    const len = (p / 100) * total
    return `${len}, ${total}`
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
    let data
    try {
      data = JSON.parse(event.data)
    } catch (e) {
      return
    }
    if (data && data.idle === true) {
      startOfflinePlayback()
      return
    }
    // Stop offline playback if it was running
    stopOfflinePlayback()
    // Use common handler
    handleIncomingData(data)
  }

  websocket.onclose = () => {
    hasLiveData.value = false
    cameraActive.value = false
    lightsOn.value = false
    wheelDirection = 0
    if (powerEnabled.value) {
      scheduleReconnect()
    }
    // Start offline playback when connection drops or power is off
    startOfflinePlayback()
  }

  websocket.onerror = () => {
    try { websocket.close() } catch (e) {}
  }
}

const scheduleReconnect = () => {
  if (reconnectTimer) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    if (powerEnabled.value) {
      connectWebsocket()
    }
  }, 2000)
}

// -------- Offline playback (training_data) --------
const startOfflinePlayback = async () => {
  if (offlineActive.value) return
  try {
    // Load CSV once
    if (!offlineRows || offlineRows.length === 0) {
      const resp = await fetch('/training_data/data_document.csv')
      if (!resp.ok) return
      const text = await resp.text()
      offlineRows = parseTrainingCsv(text)
    }
    if (!offlineRows || offlineRows.length === 0) return
    offlineActive.value = true
    offlineIndex = 0
    // Kick off playback
    playOfflineNext()
  } catch (e) {
    // ignore
  }
}

const stopOfflinePlayback = () => {
  if (offlineTimeout) {
    clearTimeout(offlineTimeout)
    offlineTimeout = null
  }
  offlineActive.value = false
}

const playOfflineNext = () => {
  if (!offlineActive.value || offlineRows.length === 0) {
    offlineActive.value = false
    return
  }
  // Loop playback when reaching the end
  if (offlineIndex >= offlineRows.length) {
    offlineIndex = 0
  }
  const current = offlineRows[offlineIndex]
  const next = offlineRows[(offlineIndex + 1) % offlineRows.length]
  // Inject image frame as camera source; treat as active
  current.camera_active = true
  current.camera_stream_active = true
  current.camera_url = `/training_data/images/${current.timestamp}.jpg`
  handleIncomingData(current, true)
  offlineIndex += 1
  // Temporary: fixed pacing at 100ms per frame for reliability
  offlineTimeout = setTimeout(playOfflineNext, 100)
}

function parseTrainingCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim())
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i])
    if (cols.length !== headers.length) continue
    const obj = {}
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j]
      const raw = cols[j]
      obj[key] = coerceCsvValue(raw)
    }
    rows.push(obj)
  }
  return rows
}

function splitCsvLine(line) {
  // Simple CSV splitter (no embedded commas expected per provided data)
  return line.split(',')
}

function coerceCsvValue(v) {
  if (v === 'True') return true
  if (v === 'False') return false
  if (v === '') return ''
  const num = Number(v)
  return Number.isNaN(num) ? v : num
}

// Power toggle handler from Header
const onPowerToggle = (isOn) => {
  powerEnabled.value = !!isOn
  if (powerEnabled.value) {
    // When toggled on: stop offline and attempt to reconnect websocket
    stopOfflinePlayback()
    hasLiveData.value = false
    connectWebsocket()
  } else {
    // When toggled off: close websocket and play offline
    try { if (websocket) websocket.close() } catch (e) {}
    hasLiveData.value = false
    startOfflinePlayback()
  }
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
    box-shadow: inset 0 0 40px 50px #0f151b;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
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

.fluid-pressure-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  margin-bottom: 1rem;

  &.is-loaded {
    opacity: 1;
    transform: translateY(0);
  }
}

.pressure-dials {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: nowrap;
}

.pressure-dial {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.dial-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.dial-svg {
  width: 45px;
  height: 45px;
  transform: rotate(-90deg);
}

.dial-background {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 3;
  stroke-linecap: round;
}

.dial-fill {
  fill: none;
  stroke: var(--color-secondary);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 0, 126;
  transition: stroke-dasharray 0.3s ease;
  filter: drop-shadow(0 0 4px var(--color-secondary-transparent));
}

.dial-value-text {
  font-family: var(--font-heading);
  font-size: 10px;
  font-weight: 600;
  fill: #fff;
  text-anchor: middle;
  transform: rotate(90deg) translateY(-48px);
  font-variant-numeric: tabular-nums;
}

.dial-title {
  font-family: var(--font-body);
  font-size: 7px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  letter-spacing: 0.5px;
  text-transform: uppercase;
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