<template>
  <div id="app">
    <div class="main-container">
      <div class="left-panel">
        <!-- Left panel content -->
          <img src="/logo.png" alt="HeavyTech" class="logo">
          <div class="vehicle-selector">
            <img src="/v1.png" alt="">

            <img src="/v2.png" alt="">

            <img src="/v3.png" alt="">

            <img src="/v4.png" alt="">

            <img src="/v5.png" alt="">
          </div>
      </div>
      
      <div class="middle-panel">
        <Navigation @navigate="handleNavigation" :activeView="activeView" />
      </div>
      
      <div class="right-panel">
        <component :is="currentView" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navigation from './components/Navigation.vue'
import VehicleInformationView from './components/VehicleInformation.vue'
import AiVisionView from './components/AiVision.vue'
import MaintenanceView from './components/Maintenance.vue'

// Create a components object with references
const components = {
  vehicleInformation: VehicleInformationView,
  aivision: AiVisionView,
  maintenance: MaintenanceView
}

const currentView = ref(VehicleInformationView)
const activeView = ref('vehicleInformation')

const handleNavigation = (view) => {
  console.log('Navigation clicked:', view)
  const component = components[view]
  if (component) {
    currentView.value = component
    activeView.value = view
      } else {
      currentView.value = VehicleInformationView
      activeView.value = 'vehicleInformation'
    }
}
</script>

<style scoped>
#app {
  height: 100vh;
  width: 100vw;
}

.main-container {
  display: flex;
  height: 100%;
  width: 100%;
}

.left-panel {
  width: 250px;
  flex-shrink: 0;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.logo {
  margin: 30px auto;
  width: 150px;
}
.vehicle-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  flex-grow: 1;
  padding-bottom: 77px;
  img {
    max-width: 100%;
    mix-blend-mode: multiply;
  }
  & img:nth-child(1),
  & img:nth-child(5) {
    width: 90px;
    filter: blur(4px);
    opacity: .5;
  }
  & img:nth-child(2),
  & img:nth-child(4) {
    width: 120px;
    filter: blur(2px);
    opacity: .8;
  }
}

.middle-panel {
  width: 170px;
  flex-shrink: 0;
}

.right-panel {
  flex: 1;
  background-color: var(--color-background-dark);
  color: #fff;
  font-family: var(--font-body);
}
</style>
