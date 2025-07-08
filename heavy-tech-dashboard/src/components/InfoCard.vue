<template>
  <div 
    class="info-card"
    :class="[
      `size-${size}`,
      { 
        'is-loading': isLoading,
        'is-loaded': isLoaded 
      }
    ]"
    :style="{ 
      gridColumn: gridColumn,
      gridRow: gridRow
    }"
  >
    <div class="card-content" :class="{ 'loading-blur': isLoading }">
      <div v-if="isLoading" class="loading-skeleton">
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-text"></div>
        <div class="skeleton-line skeleton-text short"></div>
        <div class="skeleton-line skeleton-text"></div>
      </div>
      <div v-else class="actual-content">
        <slot></slot>
      </div>
    </div>
    <div v-if="isLoading" class="loading-pulse"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, watch, type Ref } from 'vue'

interface Props {
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall'
  gridColumn?: string
  gridRow?: string
  index?: number // Index of this card in the list
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  gridColumn: 'auto',
  gridRow: 'auto',
  index: 0
})

const isLoading = ref(true)
const isLoaded = ref(false)

// Inject total count and vehicle change signal from parent
const totalCards = inject<number>('totalCards', 1)
const vehicleChangeKey = inject<Ref<number>>('vehicleChangeKey', ref(0))

const startLoadSequence = () => {
  // Reset to loading state
  isLoading.value = true
  isLoaded.value = false
  
  // Calculate staggered delay: 150ms per card index
  const animationDelay = props.index * 150
  
  console.log(`InfoCard ${props.index}/${totalCards}: starting animation with ${animationDelay}ms delay`)
  
  // After the calculated delay, show as loaded
  setTimeout(() => {
    isLoading.value = false
    isLoaded.value = true
  }, animationDelay + 500) // 500ms base delay + staggered delay
}

onMounted(() => {
  startLoadSequence()
})

// Watch for vehicle changes
watch(vehicleChangeKey, () => {
  console.log(`InfoCard ${props.index}: vehicle changed, restarting animation`)
  startLoadSequence()
})
</script>

<style scoped>
.info-card {
  background: var(--gray);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

/* Loading state - scaled back and visible by default */
.info-card.is-loading {
  transform: scale(0.9);
  opacity: 0.7;
}

/* Loaded state - full scale with animation */
.info-card.is-loaded {
  transform: scale(1);
  opacity: 1;
  animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.info-card:hover.is-loaded {
  transform: scale(1.02) translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  transition: all 0.3s ease;
}

.card-content.loading-blur {
  filter: blur(1px);
  opacity: 0.6;
}

.actual-content {
  opacity: 0;
  animation: fadeIn 0.4s ease forwards;
  animation-delay: 0.2s;
}

/* Loading skeleton */
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg, 
    rgba(0,0,0,0.08) 25%, 
    rgba(0,0,0,0.03) 50%, 
    rgba(0,0,0,0.08) 75%
  );
  background-size: 200% 100%;
  border-radius: 6px;
  animation: shimmer 1.5s infinite;
}

.skeleton-title {
  height: 16px;
  width: 60%;
}

.skeleton-text {
  width: 100%;
}

.skeleton-text.short {
  width: 40%;
}

/* Loading pulse overlay */
.loading-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(255,255,255,0.1) 50%, 
    transparent 70%
  );
  animation: pulse 2s infinite;
  pointer-events: none;
}

/* Size variants */
.size-small {
  min-height: 120px;
}

.size-medium {
  min-height: 160px;
}

.size-large {
  min-height: 200px;
}

.size-wide {
  min-height: 160px;
  grid-column: span 2;
}

.size-tall {
  min-height: 240px;
  grid-row: span 2;
}

/* Animation keyframes */
@keyframes scaleIn {
  0% {
    transform: scale(0.9);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .size-wide {
    grid-column: span 1;
  }
  
  .size-tall {
    grid-row: span 1;
    min-height: 160px;
  }
}
</style> 