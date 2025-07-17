<template>
  <div 
    class="card"
    :class="{ 'is-loaded': isLoaded }"
    :style="gridStyle"
  >
    <div class="card-content">
      <slot>test</slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'

const props = defineProps({
  gridColumn: {
    type: String,
    default: '1'
  },
  gridRow: {
    type: String,
    default: '1'
  }
})

const getNextDelay = inject('getNextDelay', () => 0)
const delay = getNextDelay()

const isLoaded = ref(false)

const gridStyle = computed(() => ({
  gridColumn: props.gridColumn,
  gridRow: props.gridRow
}))

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, delay)
})
</script>

<style scoped>
.card {
  background: var(--color-surface, #3a3a3a);
  border-radius: 8px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: loading-shimmer 2s infinite;
}

.card.is-loaded {
  opacity: 1;
  transform: translateY(0);
}

.card.is-loaded::before {
  animation: none;
}

.card-content {
  padding: 1.5rem;
  color: #fff;
  font-family: var(--font-body);
  height: 100%;
}

@media (max-width: 1280px) {
  .card-content {
    padding: 1rem;
  }
}

@keyframes loading-shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style> 