<template>
  <div class="info-cards-grid">
    <!-- Battery Status Card -->
    <InfoCard size="medium" :index="0">
      <div class="panel-title">Battery Status</div>
      <div class="panel-data">
        <div class="data-item">
          <span class="label">Health:</span>
          <span class="value">{{ vehicle.batteryHealth }}</span>
        </div>
        <div class="data-item">
          <span class="label">Charge Rate:</span>
          <span class="value">{{ vehicle.chargeRate }}</span>
        </div>
        <div class="data-item">
          <span class="label">Torque Split:</span>
          <span class="value">{{ vehicle.torqueSplit }}</span>
        </div>
        <div class="data-item">
          <span class="label">Drive Mode:</span>
          <span class="value">{{ vehicle.driveMode }}</span>
        </div>
      </div>
    </InfoCard>

    <!-- Map Location Card -->
    <InfoCard size="medium" :index="1">
      <div class="panel-title">Location</div>
      <div class="panel-data">
        <div class="data-item">
          <span class="label">Coordinates:</span>
          <span class="value">{{ vehicle.location?.coordinates }}</span>
        </div>
        <div class="data-item">
          <span class="label">Zone:</span>
          <span class="value">{{ vehicle.location?.zone }}</span>
        </div>
        <div class="data-item">
          <span class="label">Address:</span>
          <span class="value small">{{ vehicle.location?.address }}</span>
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
        <div class="status-item" :class="vehicle.connectionStatus?.toLowerCase()">
          <div class="status-dot"></div>
          <span>{{ vehicle.connectionStatus }}</span>
        </div>
        <div class="data-item">
          <span class="label">Data:</span>
          <span class="value">{{ vehicle.dataStatus }}</span>
        </div>
        <div class="data-item">
          <span class="label">AI Viz:</span>
          <span class="value">{{ vehicle.aiVizStatus }}</span>
        </div>
      </div>
    </InfoCard>

    <!-- Operational Info Card -->
    <InfoCard size="wide" :index="4">
      <div class="panel-title">Operational Data</div>
      <div class="operational-grid">
        <div class="data-item">
          <span class="label">Hours:</span>
          <span class="value">{{ vehicle.operationalHours }}</span>
        </div>
        <div class="data-item">
          <span class="label">Efficiency:</span>
          <span class="value">{{ vehicle.efficiency }}</span>
        </div>
        <div class="data-item">
          <span class="label">Fuel Level:</span>
          <span class="value">{{ vehicle.fuelLevel }}</span>
        </div>
        <div class="data-item">
          <span class="label">Engine Temp:</span>
          <span class="value">{{ vehicle.engineTemp }}</span>
        </div>
        <div class="data-item">
          <span class="label">Hydraulic PSI:</span>
          <span class="value">{{ vehicle.hydraulicPressure }}</span>
        </div>
        <div class="data-item">
          <span class="label">Work Mode:</span>
          <span class="value">{{ vehicle.workMode }}</span>
        </div>
      </div>
    </InfoCard>

    <!-- Alerts Card (if there are alerts) -->
    <InfoCard 
      v-if="vehicle.alerts && vehicle.alerts.length > 0" 
      size="medium" 
      :index="5"
    >
      <div class="panel-title alert-title">⚠️ Alerts</div>
      <div class="alerts-list">
        <div 
          v-for="alert in vehicle.alerts" 
          :key="alert"
          class="alert-item"
        >
          {{ alert }}
        </div>
      </div>
    </InfoCard>
  </div>
</template>

<script setup lang="ts">
import InfoCard from './InfoCard.vue'
import type { Vehicle } from '@/data/vehicle-data'

interface Props {
  vehicle: Vehicle
  isPowerOn: boolean
}

interface Emits {
  (e: 'toggle-power'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const togglePower = () => {
  emit('toggle-power')
}
</script>

<style scoped>
.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  align-items: start;
}

/* Reusing styles from App.vue */
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

.operational-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

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

@media (max-width: 768px) {
  .info-cards-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .operational-grid {
    grid-template-columns: 1fr;
  }
  
  .data-item .value.small {
    max-width: 70%;
    font-size: 0.7rem;
  }
}
</style> 