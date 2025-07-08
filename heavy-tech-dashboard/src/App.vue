<script setup lang="ts">
import { ref, computed, onMounted, watch, provide } from 'vue'
import VehicleSelector from '@/components/VehicleSelector.vue'
import InfoCard from '@/components/InfoCard.vue'
import { vehicleData } from '@/data/vehicle-data'

const vehicles = ref(vehicleData)
const currentVehicleIndex = ref(2) // Start with vehicle #3
const isPowerOn = ref(false)
const activeTab = ref('fleet')
const vehicleChangeKey = ref(0) // Reactive key for vehicle changes

const currentVehicle = computed(() => {
  return vehicles.value[currentVehicleIndex.value] || {}
})

// Count total cards (including conditional alerts card)
const totalCards = computed(() => {
  let count = 5 // battery, location, power, status, operational
  if (currentVehicle.value.alerts && currentVehicle.value.alerts.length > 0) {
    count += 1 // alerts card
  }
  return count
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

        <!-- Information Cards Grid -->
        <div class="info-cards-grid">
          <!-- Battery Status Card -->
          <InfoCard size="medium" :index="0">
            <div class="panel-title">Battery Status</div>
            <div class="panel-data">
              <div class="data-item">
                <span class="label">Health:</span>
                <span class="value">{{ currentVehicle.batteryHealth }}</span>
              </div>
              <div class="data-item">
                <span class="label">Charge Rate:</span>
                <span class="value">{{ currentVehicle.chargeRate }}</span>
              </div>
              <div class="data-item">
                <span class="label">Torque Split:</span>
                <span class="value">{{ currentVehicle.torqueSplit }}</span>
              </div>
              <div class="data-item">
                <span class="label">Drive Mode:</span>
                <span class="value">{{ currentVehicle.driveMode }}</span>
              </div>
            </div>
          </InfoCard>

          <!-- Map Location Card -->
          <InfoCard size="medium" :index="1">
            <div class="panel-title">Location</div>
            <div class="panel-data">
              <div class="data-item">
                <span class="label">Coordinates:</span>
                <span class="value">{{ currentVehicle.location?.coordinates }}</span>
              </div>
              <div class="data-item">
                <span class="label">Zone:</span>
                <span class="value">{{ currentVehicle.location?.zone }}</span>
              </div>
              <div class="data-item">
                <span class="label">Address:</span>
                <span class="value small">{{ currentVehicle.location?.address }}</span>
              </div>
            </div>
          </InfoCard>

          <!-- Power Control Card -->
          <InfoCard size="small" :index="2">
            <div class="panel-title">Power Control</div>
            <div class="toggle-container">
              <div 
                class="toggle-switch" 
                :class="{ active: isPowerOn }" 
                @click="togglePower"
              >
                <div class="toggle-slider"></div>
              </div>
              <span class="power-status">{{ isPowerOn ? 'ON' : 'OFF' }}</span>
            </div>
          </InfoCard>

          <!-- Connection Status Card -->
          <InfoCard size="small" :index="3">
            <div class="panel-title">Status</div>
            <div class="panel-data">
              <div class="status-item" :class="currentVehicle.connectionStatus?.toLowerCase()">
                <div class="status-dot"></div>
                <span>{{ currentVehicle.connectionStatus }}</span>
              </div>
              <div class="data-item">
                <span class="label">Data:</span>
                <span class="value">{{ currentVehicle.dataStatus }}</span>
              </div>
              <div class="data-item">
                <span class="label">AI Viz:</span>
                <span class="value">{{ currentVehicle.aiVizStatus }}</span>
              </div>
            </div>
          </InfoCard>

          <!-- Operational Info Card -->
          <InfoCard size="wide" :index="4">
            <div class="panel-title">Operational Data</div>
            <div class="operational-grid">
              <div class="data-item">
                <span class="label">Hours:</span>
                <span class="value">{{ currentVehicle.operationalHours }}</span>
              </div>
              <div class="data-item">
                <span class="label">Efficiency:</span>
                <span class="value">{{ currentVehicle.efficiency }}</span>
              </div>
              <div class="data-item">
                <span class="label">Fuel Level:</span>
                <span class="value">{{ currentVehicle.fuelLevel }}</span>
              </div>
              <div class="data-item">
                <span class="label">Engine Temp:</span>
                <span class="value">{{ currentVehicle.engineTemp }}</span>
              </div>
              <div class="data-item">
                <span class="label">Hydraulic PSI:</span>
                <span class="value">{{ currentVehicle.hydraulicPressure }}</span>
              </div>
              <div class="data-item">
                <span class="label">Work Mode:</span>
                <span class="value">{{ currentVehicle.workMode }}</span>
              </div>
            </div>
          </InfoCard>

          <!-- Alerts Card (if there are alerts) -->
          <InfoCard 
            v-if="currentVehicle.alerts && currentVehicle.alerts.length > 0" 
            size="medium" 
            :index="5"
          >
            <div class="panel-title alert-title">⚠️ Alerts</div>
            <div class="alerts-list">
              <div 
                v-for="alert in currentVehicle.alerts" 
                :key="alert"
                class="alert-item"
              >
                {{ alert }}
              </div>
            </div>
          </InfoCard>
        </div>

        <!-- Bottom Navigation -->
        <div class="bottom-nav">
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'fleet' }" 
            @click="setActiveTab('fleet')"
          >
            <span class="nav-label">FLEET</span>
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
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'insights' }" 
            @click="setActiveTab('insights')"
          >
            <span class="nav-label">AI INSIGHTS</span>
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

/* Information Cards Grid */
.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  flex: 1;
  margin-bottom: 40px;
  align-items: start;
}

/* Card Content Styling */
.panel-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.panel-title.alert-title {
  color: #dc2626;
}

.panel-data {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.data-item .label {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.data-item .value {
  font-size: 0.9rem;
  color: #1f2937;
  font-weight: 600;
  text-align: right;
}

.data-item .value.small {
  font-size: 0.75rem;
  max-width: 60%;
  line-height: 1.2;
}

/* Operational Grid */
.operational-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

/* Status Items */
.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dc2626;
}

.status-item.connected .status-dot {
  background: #16a34a;
}

.status-item.disconnected .status-dot {
  background: #dc2626;
}

/* Toggle Container */
.toggle-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.power-status {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

/* Toggle Switch Component */
.toggle-switch {
  width: 60px;
  height: 32px;
  background: #e5e7eb;
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-switch.active {
  background: #3b82f6;
}

.toggle-slider {
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-switch.active .toggle-slider {
  transform: translateX(28px);
}

/* Alerts */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.alert-item {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.85rem;
  color: #dc2626;
  line-height: 1.3;
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
  
  .info-cards-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .operational-grid {
    grid-template-columns: 1fr;
  }
  
  .vehicle-title h1 {
    font-size: 2rem;
  }
  
  .vehicle-title {
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .vehicle-details {
    padding: 15px;
  }
  
  .vehicle-title h1 {
    font-size: 1.5rem;
  }
  
  .data-item .value.small {
    max-width: 70%;
    font-size: 0.7rem;
  }
}
</style>
