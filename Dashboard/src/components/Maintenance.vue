<template>
  <div class="maintenance">
    <Header>
      <template #title>
        MAINTENANCE
      </template>
      <template #subtitle>
        Front End Loader
      </template>
    </Header>
    
    <div class="maintenance-container">
      <!-- Left column - Maintenance Items -->
      <div class="maintenance-list">
        <div class="maint-card" :class="{ 'is-loaded': cardStates.track }">
          <div class="maintenance-item-header">
            <h3 class="maintenance-item-title">TRACK LIFESPAN</h3>
            <div class="maintenance-item-hours">900 / 1000 hrs</div>
          </div>
          <div class="maintenance-item-content">
            <div class="lifespan-bar">
              <div class="lifespan-bar-fill" :style="{ width: '90%' }" data-color="yellow"></div>
            </div>
            <button class="reset-button">
              <Icon icon="tabler:refresh" />
            </button>
          </div>
        </div>

        <div class="maint-card" :class="{ 'is-loaded': cardStates.bucket }">
          <div class="maintenance-item-header">
            <h3 class="maintenance-item-title">BUCKET LIFESPAN</h3>
            <div class="maintenance-item-hours">900 / 1000 hrs</div>
          </div>
          <div class="maintenance-item-content">
            <div class="lifespan-bar">
              <div class="lifespan-bar-fill" :style="{ width: '30%' }" data-color="yellow"></div>
            </div>
            <button class="reset-button">
              <Icon icon="tabler:refresh" />
            </button>
          </div>
        </div>

        <div class="maint-card" :class="{ 'is-loaded': cardStates.oil }">
          <div class="maintenance-item-header">
            <h3 class="maintenance-item-title">OIL LIFESPAN</h3>
            <div class="maintenance-item-hours">900 / 1000 hrs</div>
          </div>
          <div class="maintenance-item-content">
            <div class="lifespan-bar">
              <div class="lifespan-bar-fill" :style="{ width: '90%' }" data-color="green"></div>
            </div>
            <button class="reset-button">
              <Icon icon="tabler:refresh" />
            </button>
          </div>
        </div>

        <div class="maint-card" :class="{ 'is-loaded': cardStates.leds }">
          <div class="maintenance-item-header">
            <h3 class="maintenance-item-title">LEDS LIFESPAN</h3>
            <div class="maintenance-item-hours">900 / 1000 hrs</div>
          </div>
          <div class="maintenance-item-content">
            <div class="lifespan-bar">
              <div class="lifespan-bar-fill" :style="{ width: '90%' }" data-color="green"></div>
            </div>
            <button class="reset-button">
              <Icon icon="tabler:refresh" />
            </button>
          </div>
        </div>
      </div>

      <!-- Right column - Error Log -->
      <div class="error-log" :class="{ 'is-loaded': cardStates.errorLog }">
        <h3 class="error-log-title">ERROR LOG</h3>
        <div class="error-log-content">
          <div class="error-item">
            <span class="error-code">ERR103</span>
            <span class="error-description">- Temp out of range</span>
          </div>
          <div class="error-item">
            <span class="error-code">ERR105</span>
            <span class="error-description">- Hydraulic pressure low</span>
          </div>
          <div class="error-item">
            <span class="error-code">ERR201</span>
            <span class="error-description">- Battery voltage critical</span>
          </div>
          <div class="error-item">
            <span class="error-code">ERR087</span>
            <span class="error-description">- Engine oil pressure</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from './Header.vue';

// Reactive state for each card's loaded state
const cardStates = ref({
  track: false,
  bucket: false,
  oil: false,
  leds: false,
  errorLog: false
})

// Trigger fade-in animations with delays
onMounted(() => {
  const cards = ['track', 'bucket', 'oil', 'leds', 'errorLog']
  
  cards.forEach((cardName, index) => {
    setTimeout(() => {
      cardStates.value[cardName] = true
    }, index * 150) // 150ms delay between each card
  })
})
</script>

<style scoped>
.maintenance {
  height: 100%;
  width: 100%;
  overflow: auto;
  padding-right: 2rem;
}

.maintenance-container {
  display: flex;
  gap: 1rem;
  width: 100%;
  height: calc(100% - 150px);
}

.maintenance-list {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.maint-card {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 1.5rem;
  color: #fff;
  font-family: var(--font-body);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  position: relative;
}

.maint-card.is-loaded {
  opacity: 1;
  transform: translateY(0);
}

.maint-card.is-loaded::before {
  animation: none;
}

@keyframes loading-shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.maintenance-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.maintenance-item-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  color: #fff;
  margin: 0;
}

.maintenance-item-hours {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.maintenance-item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lifespan-bar {
  flex: 1;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  position: relative;
}

.lifespan-bar-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.3s ease;
  position: relative;
}

.lifespan-bar-fill[data-color="yellow"] {
  background: var(--color-secondary);
  box-shadow: 0 0 10px var(--color-secondary-transparent);
}

.lifespan-bar-fill[data-color="green"] {
  background: var(--color-primary);
  box-shadow: 0 0 10px var(--color-primary-transparent);
}

.reset-button {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

.reset-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  color: #fff;
}

.reset-button svg {
  width: 20px;
  height: 20px;
}

.error-log {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border-radius: 8px;
  padding: 1.5rem;
  color: #fff;
  font-family: var(--font-body);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  position: relative;
}


.error-log.is-loaded {
  opacity: 1;
  transform: translateY(0);
}

.error-log.is-loaded::before {
  animation: none;
}

.error-log-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  color: #fff;
  margin: 0 0 1.5rem 0;
}

.error-log-content {
  flex: 1;
  overflow-y: auto;
}

.error-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: var(--font-body);
}

.error-item:last-child {
  border-bottom: none;
}

.error-code {
  font-weight: 600;
  color: var(--color-error);
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.error-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* Scrollbar styling */
.maintenance-list::-webkit-scrollbar,
.error-log-content::-webkit-scrollbar {
  display: none;
}
</style> 