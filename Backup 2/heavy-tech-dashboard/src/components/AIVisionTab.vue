<template>
  <div class="ai-vision-container">
    <!-- Main 3D Viewer -->
    <div class="viewer-section">
      <canvas ref="canvasRef" class="three-canvas"></canvas>
      
      <!-- Status Overlay -->
      <div class="status-overlay">
        <div class="ai-status">
          <span class="status-label">AI VISION:</span>
          <span class="status-value" :class="{ active: vehicle.aiVizStatus === 'Active' }">
            {{ vehicle.aiVizStatus?.toUpperCase() }}
          </span>
        </div>
      </div>

      <!-- Camera Feed -->
      <div class="camera-feed">
        <div class="camera-header">
          <div class="record-dot"></div>
          <span>LIVE FEED</span>
          <div class="telem-status">TELEMETRY</div>
        </div>
        <div class="camera-content">
          <video 
            ref="videoRef"
            class="camera-video"
            loop 
            muted 
            playsinline
            @loadeddata="onVideoLoaded"
          >
            <source src="/loader.mp4" type="video/mp4">
          </video>
          <div class="camera-placeholder" v-if="!videoLoaded">
            CAMERA FEED<br>INITIALIZING...
          </div>
        </div>
      </div>
    </div>

    <!-- Control Panel -->
    <div class="control-panel">
      <InfoCard size="small" :index="0">
        <div class="controls-grid">
          <div class="pivot-control">
            <label>Pivot 1</label>
            <input 
              type="range" 
              v-model="motionControls.centerPivot" 
              min="-80" 
              max="4" 
              @input="updateMachine"
            >
            <span>{{ motionControls.centerPivot }}°</span>
          </div>
          <div class="pivot-control">
            <label>Pivot 2</label>
            <input 
              type="range" 
              v-model="motionControls.armGroup" 
              min="250" 
              max="360" 
              @input="updateMachine"
            >
            <span>{{ motionControls.armGroup }}°</span>
          </div>
          <div class="pivot-control">
            <label>Pivot 3</label>
            <input 
              type="range" 
              v-model="motionControls.bucket" 
              min="0" 
              max="50" 
              @input="updateMachine"
            >
            <span>{{ motionControls.bucket }}°</span>
          </div>
        </div>
      </InfoCard>

      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import InfoCard from './InfoCard.vue'
import type { Vehicle } from '@/data/vehicle-data'

interface Props {
  vehicle: Vehicle
}

const props = defineProps<Props>()

// Template refs
const canvasRef = ref<HTMLCanvasElement>()
const videoRef = ref<HTMLVideoElement>()

// Three.js objects
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let orbitControls: OrbitControls | null = null
let model: THREE.Group
let mixer: any
let clock = new THREE.Clock()

// Equipment parts
let frontPivot: THREE.Object3D | null = null
let armGroup: THREE.Object3D | null = null
let bucket: THREE.Object3D | null = null

// Component state
const videoLoaded = ref(false)
const isAnimating = ref(false)
const animationStartTime = ref(0)

// Motion controls
const motionControls = ref({
  centerPivot: 0,
  armGroup: 360,
  bucket: 50
})

// Analytics data - simplified
const currentCycleTime = ref(28.5)
const motionEfficiency = ref(87)
const loadDetected = ref(true)
const motionPrecision = ref(94)
const currentMotionPattern = ref('Loading Cycle')
const predictedAction = ref('Bucket Lower')
const operatorSkill = ref('Expert')
const recommendations = ref([
  'Optimize arm extension for fuel efficiency',
  'Reduce idle time between cycles',
  'Consider variable speed control'
])

// Animation keyframes - updated for new pivot ranges
const keyframes = [
  { time: 0.0, pivot1: 0, pivot2: 360, pivot3: 50 },
  { time: 5.0, pivot1: 0, pivot2: 320, pivot3: 40 },
  { time: 10.0, pivot1: -20, pivot2: 300, pivot3: 30 },
  { time: 13.0, pivot1: -40, pivot2: 280, pivot3: 20 },
  { time: 17.0, pivot1: -60, pivot2: 260, pivot3: 10 },
  { time: 22.0, pivot1: -80, pivot2: 250, pivot3: 0 },
  { time: 24.0, pivot1: -80, pivot2: 250, pivot3: 0 },
  { time: 25.0, pivot1: -60, pivot2: 280, pivot3: 15 },
  { time: 28.0, pivot1: -20, pivot2: 330, pivot3: 35 },
  { time: 30.0, pivot1: 0, pivot2: 360, pivot3: 50 }
]

const onVideoLoaded = () => {
  videoLoaded.value = true
  if (videoRef.value) {
    videoRef.value.play().catch(e => {
      console.log('Video autoplay prevented:', e.message)
    })
  }
}

const initThreeJS = async () => {
  if (!canvasRef.value) return

  // Scene setup
  scene = new THREE.Scene()
  
  // Camera setup - moved closer for smaller model
  camera = new THREE.PerspectiveCamera(
    90,
    canvasRef.value.clientWidth / canvasRef.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(3, 1, 3)
  camera.lookAt(0, 0, 0)

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvasRef.value, 
    antialias: true, 
    alpha: true
  })
  renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.LinearToneMapping
  renderer.toneMappingExposure = 0.8
  renderer.setClearColor(0x000000, 0)

  // Lighting setup
  const ambientLight = new THREE.AmbientLight(0x404040, 10)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 5.0)
  directionalLight.position.set(0, 35, 10)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 4096
  directionalLight.shadow.mapSize.height = 4096
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.left = -15
  directionalLight.shadow.camera.right = 15
  directionalLight.shadow.camera.top = 15
  directionalLight.shadow.camera.bottom = -15
  directionalLight.shadow.bias = -0.0001
  scene.add(directionalLight)

  // Fill lights
  const fillLight1 = new THREE.DirectionalLight(0xffffff, 0.3)
  fillLight1.position.set(-10, 8, -10)
  scene.add(fillLight1)

  const fillLight2 = new THREE.DirectionalLight(0xffffff, 0.2)
  fillLight2.position.set(5, 8, -15)
  scene.add(fillLight2)

  // Ground plane
  const groundGeometry = new THREE.PlaneGeometry(20, 20)
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -.5
  ground.receiveShadow = true
  scene.add(ground)

  // Controls setup
  orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.enableDamping = true
  orbitControls.dampingFactor = 0.05
  orbitControls.screenSpacePanning = false
  orbitControls.minDistance = 2
  orbitControls.maxDistance = 20
  orbitControls.maxPolarAngle = Math.PI / 2

  // Load 3D model
  await loadModel()

  // Start animation loop
  animate()
}

const loadModel = async () => {
  const loader = new GLTFLoader()
  
  try {
    const gltf = await loader.loadAsync('/loader.glb')
    model = gltf.scene
    
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    findPivotPoints()
    setInitialPosition()
    scene.add(model)
  } catch (error) {
    console.error('Error loading 3D model:', error)
  }
}

const findPivotPoints = () => {
  if (!model) return

  model.traverse((child) => {
    const name = child.name.toLowerCase()
    
    if (name.includes('pivot1')) {
      frontPivot = child
    }
    if (name.includes('pivot2')) {
      armGroup = child
    }
    if (name.includes('pivot3')) {
      bucket = child
    }
  })
}

const setInitialPosition = () => {
  if (model) {
    model.position.set(0, -.5, 0)
    model.scale.setScalar(1)
  }
}

const updateMachine = () => {
  setFrontPivotRotation(motionControls.value.centerPivot)
  setArmGroupRotation(motionControls.value.armGroup)
  setBucketRotation(motionControls.value.bucket)
}

const setFrontPivotRotation = (degrees: number) => {
  if (frontPivot) {
    frontPivot.rotation.x = THREE.MathUtils.degToRad(degrees)
  }
}

const setArmGroupRotation = (degrees: number) => {
  if (armGroup) {
    armGroup.rotation.x = THREE.MathUtils.degToRad(degrees)
  }
}

const setBucketRotation = (degrees: number) => {
  if (bucket) {
    bucket.rotation.x = THREE.MathUtils.degToRad(degrees)
  }
}

const animate = () => {
  requestAnimationFrame(animate)
  
  const delta = clock.getDelta()
  
  if (orbitControls) {
    orbitControls.update()
  }
  
  if (mixer) {
    mixer.update(delta)
  }
  
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

const handleResize = () => {
  if (!canvasRef.value || !camera || !renderer) return
  
  const width = canvasRef.value.clientWidth
  const height = canvasRef.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(async () => {
  await nextTick()
  await initThreeJS()
  window.addEventListener('resize', handleResize)
  
  // Start automated motion pattern
  setTimeout(() => {
    startAutomatedSequence()
  }, 2000)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (renderer) {
    renderer.dispose()
  }
})

const startAutomatedSequence = () => {
  isAnimating.value = true
  animationStartTime.value = performance.now()
  animatedSequence()
}

const animatedSequence = () => {
  if (!isAnimating.value) return
  
  const elapsed = (performance.now() - animationStartTime.value) / 1000
  const loopTime = 30
  const currentTime = elapsed % loopTime
  
  const position = getInterpolatedPosition(currentTime)
  
  motionControls.value.centerPivot = position.pivot1
  motionControls.value.armGroup = position.pivot2
  motionControls.value.bucket = position.pivot3
  
  updateMachine()
  updateAnalytics(currentTime, position)
  
  requestAnimationFrame(animatedSequence)
}

const getInterpolatedPosition = (currentTime: number) => {
  const totalKeyframes = keyframes.length
  
  for (let i = 0; i < totalKeyframes - 1; i++) {
    const current = keyframes[i]
    const next = keyframes[i + 1]
    
    if (currentTime >= current.time && currentTime <= next.time) {
      const progress = (currentTime - current.time) / (next.time - current.time)
      const easedProgress = easeInOutCubic(progress)
      
      return {
        pivot1: lerp(current.pivot1, next.pivot1, easedProgress),
        pivot2: lerp(current.pivot2, next.pivot2, easedProgress),
        pivot3: lerp(current.pivot3, next.pivot3, easedProgress)
      }
    }
  }
  
  return keyframes[0]
}

const lerp = (start: number, end: number, progress: number) => {
  return start + (end - start) * progress
}

const easeInOutCubic = (t: number) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

const updateAnalytics = (currentTime: number, position: any) => {
  const cycleProgress = (currentTime % 30) / 30
  
  motionEfficiency.value = Math.round(85 + Math.sin(cycleProgress * Math.PI * 2) * 5)
  motionPrecision.value = Math.round(92 + Math.cos(cycleProgress * Math.PI * 4) * 3)
  loadDetected.value = position.pivot3 < 25
  
  if (currentTime < 5) {
    currentMotionPattern.value = 'Positioning'
    predictedAction.value = 'Pivot Lower'
  } else if (currentTime < 15) {
    currentMotionPattern.value = 'Working Cycle'
    predictedAction.value = 'Extension'
  } else if (currentTime < 25) {
    currentMotionPattern.value = 'Maximum Extension'
    predictedAction.value = 'Hold Position'
  } else {
    currentMotionPattern.value = 'Return Position'
    predictedAction.value = 'Reset Cycle'
  }
}
</script>

<style scoped>
.ai-vision-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.viewer-section {
  position: relative;
  flex: 1;
  min-height: 600px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
}

.three-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.status-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 16px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.status-label {
  font-size: 0.9rem;
  color: #ccc;
  font-weight: 500;
}

.status-value {
  font-size: 1rem;
  font-weight: 700;
  color: #dc2626;
  transition: color 0.3s ease;
}

.status-value.active {
  color: #00ff88;
}

.camera-feed {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  height: 180px;
  background: #1a1a1a;
  border: 2px solid #444;
  border-radius: 8px;
  overflow: hidden;
  z-index: 10;
}

.camera-header {
  background: #333;
  padding: 6px 12px;
  font-size: 11px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.record-dot {
  width: 8px;
  height: 8px;
  background: #ff0000;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.telem-status {
  margin-left: auto;
  opacity: 0.7;
}

.camera-content {
  position: relative;
  width: 100%;
  height: calc(100% - 28px);
  background: #222;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 12px;
  text-align: center;
  line-height: 1.4;
}

.control-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.controls-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pivot-control {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pivot-control label {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.pivot-control input[type="range"] {
  width: 100%;
  accent-color: #3b82f6;
}

.pivot-control span {
  font-size: 0.8rem;
  color: #1f2937;
  font-weight: 600;
  text-align: center;
}

.analytics-data {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.data-row .label {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.data-row .value {
  font-size: 0.85rem;
  color: #1f2937;
  font-weight: 600;
}

.data-row .value.positive {
  color: #16a34a;
}

.data-row .value.negative {
  color: #dc2626;
}

.ai-analysis {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.analysis-item {
  padding: 8px 12px;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 6px;
}

.analysis-title {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 4px;
}

.analysis-value {
  font-size: 0.9rem;
  color: #1f2937;
  font-weight: 600;
}

.analysis-recommendations {
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 6px;
  padding: 12px;
}

.rec-title {
  font-size: 0.85rem;
  color: #10b981;
  font-weight: 600;
  margin-bottom: 8px;
}

.analysis-recommendations ul {
  margin: 0;
  padding-left: 16px;
}

.analysis-recommendations li {
  font-size: 0.8rem;
  color: #374151;
  line-height: 1.4;
  margin-bottom: 4px;
}

@media (max-width: 768px) {
  .viewer-section {
    min-height: 300px;
  }
  
  .camera-feed {
    width: 200px;
    height: 120px;
  }
  
  .control-panel {
    grid-template-columns: 1fr;
  }
}
</style> 