<script setup lang="ts">
import { ref, computed, onMounted, watch, provide } from 'vue'
import VehicleSelector from '@/components/VehicleSelector.vue'
import VehicleStatusTab from '@/components/VehicleStatusTab.vue'
import MaintenanceTab from '@/components/MaintenanceTab.vue'
import AIVisionTab from '@/components/AIVisionTab.vue'
import { vehicleData } from '@/data/vehicle-data'

const vehicles = ref(vehicleData)
const currentVehicleIndex = ref(2) // Start with vehicle #3
const isPowerOn = ref(false)
const activeTab = ref('status') // Changed from 'fleet' to 'status'
const vehicleChangeKey = ref(0) // Reactive key for vehicle changes

const currentVehicle = computed(() => {
  return vehicles.value[currentVehicleIndex.value] || {}
})

// Count total cards based on active tab
const totalCards = computed(() => {
  if (activeTab.value === 'status') {
    let count = 5 // battery, location, power, status, operational
    if (currentVehicle.value.alerts && currentVehicle.value.alerts.length > 0) {
      count += 1 // alerts card
    }
    return count
  } else if (activeTab.value === 'maintenance') {
    // maintenance overview + maintenance items + schedule + parts
    return 2 + currentVehicle.value.maintenance?.length || 0 + 2
  } else if (activeTab.value === 'ai-vision') {
    return 3 // motion control, analytics, ai analysis
  }
  return 1
})

// Provide values to child components
provide('totalCards', totalCards.value)
provide('vehicleChangeKey', vehicleChangeKey)

const onVehicleSelected = (index: number) => {
  currentVehicleIndex.value = index
}

const togglePower = () => {
  isPowerOn.value = !isPowerOn.value
  console.log('Power toggled:', isPowerOn.value)
}

const setActiveTab = (tab: string) => {
  activeTab.value = tab
  console.log('Active tab:', tab)
}

// Watch for vehicle changes and increment the change key
watch(currentVehicleIndex, () => {
  vehicleChangeKey.value++
  console.log(`Vehicle changed to ${currentVehicle.value.name}, change key: ${vehicleChangeKey.value}`)
})

// Watch for tab changes and reset animation
watch(activeTab, () => {
  vehicleChangeKey.value++
  console.log(`Tab changed to ${activeTab.value}, resetting animations`)
})

onMounted(() => {
  console.log('Heavy Tech AI Vision Dashboard loaded')
  console.log('Current vehicle:', currentVehicle.value)
  // Initial load trigger
  vehicleChangeKey.value++
})
</script>

<template>
  <div class="app">
    <div class="dashboard">
      <!-- Vehicle Selector Component -->
      <VehicleSelector 
        :vehicles="vehicles" 
        :current-vehicle-index="currentVehicleIndex"
        @vehicle-selected="onVehicleSelected"
      />

      <div class="vehicle-details">
        <!-- Vehicle Title -->
        <div class="vehicle-title">
          <h1>{{ currentVehicle.name }}</h1>
        </div>

        <!-- Tab Content Area -->
        <div class="tab-content">
          <!-- Vehicle Status Tab -->
          <VehicleStatusTab 
            v-if="activeTab === 'status'"
            :vehicle="currentVehicle"
            :is-power-on="isPowerOn"
            @toggle-power="togglePower"
          />

          <!-- Maintenance Tab -->
          <MaintenanceTab 
            v-if="activeTab === 'maintenance'"
            :vehicle="currentVehicle"
          />

          <!-- AI Vision Tab -->
          <AIVisionTab 
            v-if="activeTab === 'ai-vision'"
            :vehicle="currentVehicle"
          />
        </div>

        <!-- Bottom Navigation -->
        <div class="bottom-nav">
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'status' }" 
            @click="setActiveTab('status')"
          >
            <span class="nav-label">VEHICLE STATUS</span>
            <div class="nav-indicator"></div>
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'ai-vision' }" 
            @click="setActiveTab('ai-vision')"
          >
            <span class="nav-label">AI VISION</span>
            <div class="nav-indicator"></div>
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'maintenance' }" 
            @click="setActiveTab('maintenance')"
          >
            <span class="nav-label">MAINTENANCE</span>
            <div class="nav-indicator"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --gray: #E9ECF2;
}

html {
  background: #000;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--gray);
  color: #333;
  overflow: hidden;
  height: 100vh;
  border-radius: 30px;
  overflow: hidden;
}

.app {
  height: 100vh;
}

.dashboard {
  display: flex;
  height: 100vh;
  transition: all 0.3s ease;
  position: relative;
}

/* ===== VEHICLE DETAILS COMPONENT STYLES ===== */
.vehicle-details {
  background: #fff;
  border-radius: 30px;
  width: 70%;
  display: flex;
  flex-direction: column;
  padding: 40px;
}

/* Vehicle Title */
.vehicle-title {
  text-align: center;
  margin-bottom: 40px;
}

.vehicle-title h1 {
  font-size: 2.5rem;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: -0.02em;
  line-height: 1.2;
  transition: all 0.3s ease;
}

/* Tab Content Area */
.tab-content {
  flex: 1;
  margin-bottom: 40px;
  overflow-y: auto;
}

/* Bottom Navigation Component */
.bottom-nav {
  display: flex;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.nav-item {
  flex: 1;
  background: none;
  border: none;
  padding: 16px 20px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.5);
}

.nav-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.nav-item.active .nav-label {
  color: #1f2937;
}

.nav-indicator {
  width: 0;
  height: 3px;
  background: #f59e0b;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item.active .nav-indicator {
  width: 40px;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }
  
  .vehicle-details {
    width: 100%;
    height: 60%;
    padding: 20px;
  }
  
  .vehicle-title h1 {
    font-size: 2rem;
  }
  
  .vehicle-title {
    margin-bottom: 20px;
  }
  
  .nav-label {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .vehicle-details {
    padding: 15px;
  }
  
  .vehicle-title h1 {
    font-size: 1.5rem;
  }
  
  .nav-label {
    font-size: 0.7rem;
  }
}
</style>
