<template>
  <div id="app">
    <div class="main-container">
      <div class="left-panel">
        <!-- Left panel content -->
        <div class="left-panel-content">
          <h2>Left Panel</h2>
          <p>Content goes here</p>
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
}

.left-panel-content {
  padding: 1rem;
}

.left-panel-content h2 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.left-panel-content p {
  font-family: var(--font-body);
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
