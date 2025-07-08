<template>
  <div class="vehicle-slider">
    <div 
      ref="vehicleList" 
      class="vehicle-list" 
      @scroll="updateVehicleEffects"
    >
      <div 
        v-for="(vehicle, index) in vehicles" 
        :key="vehicle.id"
        :ref="(el: any) => setVehicleRef(el as HTMLElement, index)"
        class="vehicle-item"
        @click="selectVehicle(index)"
      >
        <img :src="vehicle.image" :alt="vehicle.name">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, type Ref } from 'vue'
import type { Vehicle } from '@/data/vehicle-data'

interface Props {
  vehicles: Vehicle[]
  currentVehicleIndex: number
}

interface Emits {
  (e: 'vehicle-selected', index: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const vehicleList: Ref<HTMLElement | null> = ref(null)
const vehicleElements: Ref<(HTMLElement | null)[]> = ref([])

const setVehicleRef = (el: HTMLElement | null, index: number) => {
  vehicleElements.value[index] = el
}

const selectVehicle = (index: number) => {
  emit('vehicle-selected', index)
}

const centerCurrentVehicle = () => {
  if (!vehicleList.value) return
  
  const currentVehicle = vehicleElements.value[props.currentVehicleIndex]
  
  if (currentVehicle) {
    const listHeight = vehicleList.value.clientHeight
    const vehicleHeight = currentVehicle.offsetHeight + 30
    const vehicleTop = currentVehicle.offsetTop
    const centerPosition = vehicleTop - (listHeight / 2) + (vehicleHeight / 2)
    
    vehicleList.value.scrollTo({
      top: centerPosition,
      behavior: 'smooth'
    })
  }
}

const updateVehicleEffects = () => {
  if (!vehicleList.value) return
  
  const listRect = vehicleList.value.getBoundingClientRect()
  const centerY = listRect.top + listRect.height / 2

  let closestIndex = 0
  let closestDistance = Infinity

  vehicleElements.value.forEach((element, index) => {
    if (!element) return
    
    const elementRect = element.getBoundingClientRect()
    const elementCenterY = elementRect.top + elementRect.height / 2
    const distanceFromCenter = Math.abs(elementCenterY - centerY)
    
    if (distanceFromCenter < closestDistance) {
      closestDistance = distanceFromCenter
      closestIndex = index
    }
    
    const maxDistance = listRect.height / 2
    const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1)
    
    const scale = 1.0 - (normalizedDistance * 0.6)
    const opacity = 1.0 - (normalizedDistance * 0.8)
    const blur = normalizedDistance * 8
    
    element.style.transform = `scale(${scale})`
    element.style.opacity = opacity.toString()
    element.style.filter = `blur(${blur}px)`
  })

  if (closestIndex !== props.currentVehicleIndex) {
    emit('vehicle-selected', closestIndex)
  }
}

const setupKeyboardListeners = () => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && props.currentVehicleIndex > 0) {
      selectVehicle(props.currentVehicleIndex - 1)
    } else if (e.key === 'ArrowDown' && props.currentVehicleIndex < props.vehicles.length - 1) {
      selectVehicle(props.currentVehicleIndex + 1)
    }
  })
}

watch(() => props.currentVehicleIndex, () => {
  nextTick(() => {
    centerCurrentVehicle()
    updateVehicleEffects()
  })
})

onMounted(() => {
  setupKeyboardListeners()
  nextTick(() => {
    updateVehicleEffects()
    centerCurrentVehicle()
  })
})
</script>

<style scoped>
.vehicle-slider {
  width: 30%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.vehicle-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 300px 0;
  scroll-snap-type: y mandatory;
}

.vehicle-list::-webkit-scrollbar {
  display: none;
}

.vehicle-item {
  width: 100%;
  aspect-ratio: 1;
  margin: -7vw 0;
  cursor: pointer;
  transition: all 0.1s ease-out;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  mix-blend-mode: multiply;
  scroll-snap-align: center;
  padding: 20px;
}

.vehicle-item img {
  width: 100%;
  max-width: 300px;
  height: 100%;
  object-fit: contain;
}

@media (max-width: 768px) {
  .vehicle-slider {
    width: 100%;
    height: 40%;
  }
}
</style> 