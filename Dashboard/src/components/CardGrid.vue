<template>
  <div class="card-grid">
    <slot></slot>
  </div>
</template>

<script setup>
import { provide, ref } from 'vue'

const cardCount = ref(0)

const getNextDelay = () => {
  const delay = cardCount.value * 150
  cardCount.value++
  return delay
}

provide('getNextDelay', getNextDelay)
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
  height: calc(100% - 180px);
}
</style> 