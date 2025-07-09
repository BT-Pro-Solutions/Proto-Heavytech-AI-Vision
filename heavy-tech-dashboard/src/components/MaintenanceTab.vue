<template>
  <div class="info-cards-grid">
    <!-- Maintenance Overview Card -->
    <InfoCard size="wide" :index="0">
      <div class="panel-title">Maintenance Overview</div>
      <div class="maintenance-overview">
        <div class="overview-stats">
          <div class="stat-item">
            <div class="stat-value">{{ vehicle.operationalHours }}</div>
            <div class="stat-label">Total Hours</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ lastMaintenanceDate }}</div>
            <div class="stat-label">Last Service</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ nextMaintenanceDate }}</div>
            <div class="stat-label">Next Service</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" :class="maintenanceStatus">{{ maintenanceStatusText }}</div>
            <div class="stat-label">Status</div>
          </div>
        </div>
      </div>
    </InfoCard>

    <!-- Maintenance Items -->
    <InfoCard 
      v-for="(item, index) in vehicle.maintenance" 
      :key="item.component"
      size="medium" 
      :index="index + 1"
    >
      <div class="panel-title">{{ item.component }}</div>
      <div class="maintenance-item">
        <div class="progress-section">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :class="item.status"
              :style="{ width: `${(item.currentHours / item.maxHours) * 100}%` }"
            ></div>
          </div>
          <div class="progress-text">
            {{ item.currentHours }}h / {{ item.maxHours }}h
          </div>
        </div>
        
        <div class="maintenance-details">
          <div class="data-item">
            <span class="label">Status:</span>
            <span class="value" :class="item.status">{{ statusText(item.status) }}</span>
          </div>
          <div class="data-item">
            <span class="label">Last Service:</span>
            <span class="value">{{ formatDate(item.lastService) }}</span>
          </div>
          <div class="data-item">
            <span class="label">Next Service:</span>
            <span class="value" :class="{ overdue: item.nextService === 'Overdue' }">{{ item.nextService === 'Overdue' ? 'Overdue' : formatDate(item.nextService) }}</span>
          </div>
        </div>
        
        <div class="maintenance-description">
          <p>{{ item.description }}</p>
        </div>
      </div>
    </InfoCard>

    <!-- Service Schedule Card -->
    <InfoCard size="medium" :index="vehicle.maintenance.length + 1">
      <div class="panel-title">📅 Service Schedule</div>
      <div class="service-schedule">
        <div class="schedule-item" v-for="item in upcomingServices" :key="item.component">
          <div class="schedule-date" :class="item.urgency">{{ item.daysUntil }}</div>
          <div class="schedule-details">
            <div class="schedule-component">{{ item.component }}</div>
            <div class="schedule-type">{{ item.type }}</div>
          </div>
        </div>
      </div>
    </InfoCard>

    <!-- Parts Inventory Card -->
    <InfoCard size="small" :index="vehicle.maintenance.length + 2">
      <div class="panel-title">🔧 Parts Status</div>
      <div class="parts-status">
        <div class="parts-item">
          <span class="parts-name">Filters</span>
          <span class="parts-count in-stock">3 in stock</span>
        </div>
        <div class="parts-item">
          <span class="parts-name">Oil</span>
          <span class="parts-count low-stock">1 low</span>
        </div>
        <div class="parts-item">
          <span class="parts-name">Belts</span>
          <span class="parts-count in-stock">2 in stock</span>
        </div>
        <div class="parts-item">
          <span class="parts-name">Hoses</span>
          <span class="parts-count out-of-stock">0 order needed</span>
        </div>
      </div>
    </InfoCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import InfoCard from './InfoCard.vue'
import type { Vehicle } from '@/data/vehicle-data'

interface Props {
  vehicle: Vehicle
}

const props = defineProps<Props>()

const lastMaintenanceDate = computed(() => {
  return new Date(props.vehicle.lastMaintenance).toLocaleDateString()
})

const nextMaintenanceDate = computed(() => {
  return new Date(props.vehicle.nextMaintenance).toLocaleDateString()
})

const maintenanceStatus = computed(() => {
  const critical = props.vehicle.maintenance.some(item => item.status === 'critical')
  const warning = props.vehicle.maintenance.some(item => item.status === 'warning')
  
  if (critical) return 'critical'
  if (warning) return 'warning'
  return 'good'
})

const maintenanceStatusText = computed(() => {
  const status = maintenanceStatus.value
  if (status === 'critical') return 'Critical'
  if (status === 'warning') return 'Warning' 
  return 'Good'
})

const upcomingServices = computed(() => {
  return props.vehicle.maintenance
    .filter(item => item.nextService !== 'Overdue')
    .map(item => {
      const nextDate = new Date(item.nextService)
      const today = new Date()
      const diffTime = nextDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      let urgency = 'normal'
      let daysText = `${diffDays} days`
      
      if (diffDays < 0) {
        urgency = 'overdue'
        daysText = 'Overdue'
      } else if (diffDays <= 7) {
        urgency = 'urgent'
      } else if (diffDays <= 30) {
        urgency = 'soon'
      }
      
      return {
        component: item.component,
        type: item.description.split(' ').slice(0, 2).join(' '),
        daysUntil: daysText,
        urgency
      }
    })
    .sort((a, b) => {
      if (a.urgency === 'overdue' && b.urgency !== 'overdue') return -1
      if (b.urgency === 'overdue' && a.urgency !== 'overdue') return 1
      return 0
    })
})

const statusText = (status: string) => {
  switch (status) {
    case 'good': return 'Good'
    case 'warning': return 'Warning'
    case 'critical': return 'Critical'
    default: return status
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  align-items: start;
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

/* Maintenance Overview */
.maintenance-overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 8px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-value.good {
  color: #16a34a;
}

.stat-value.warning {
  color: #f59e0b;
}

.stat-value.critical {
  color: #dc2626;
}

.stat-label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

/* Maintenance Items */
.maintenance-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.progress-fill.good {
  background: #16a34a;
}

.progress-fill.warning {
  background: #f59e0b;
}

.progress-fill.critical {
  background: #dc2626;
}

.progress-text {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
  text-align: center;
}

.maintenance-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0;
}

.data-item .label {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.data-item .value {
  font-size: 0.85rem;
  color: #1f2937;
  font-weight: 600;
  text-align: right;
}

.data-item .value.good {
  color: #16a34a;
}

.data-item .value.warning {
  color: #f59e0b;
}

.data-item .value.critical {
  color: #dc2626;
}

.data-item .value.overdue {
  color: #dc2626;
  font-weight: 700;
}

.maintenance-description {
  background: rgba(107, 114, 128, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.4;
}

/* Service Schedule */
.service-schedule {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: rgba(243, 244, 246, 0.5);
  border-radius: 6px;
}

.schedule-date {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 60px;
  text-align: center;
}

.schedule-date.overdue {
  background: #fecaca;
  color: #dc2626;
}

.schedule-date.urgent {
  background: #fed7aa;
  color: #ea580c;
}

.schedule-date.soon {
  background: #fef3c7;
  color: #d97706;
}

.schedule-date.normal {
  background: #dbeafe;
  color: #2563eb;
}

.schedule-details {
  flex: 1;
}

.schedule-component {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2937;
}

.schedule-type {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Parts Status */
.parts-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.parts-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background: rgba(243, 244, 246, 0.5);
  border-radius: 6px;
}

.parts-name {
  font-size: 0.85rem;
  color: #374151;
  font-weight: 500;
}

.parts-count {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.parts-count.in-stock {
  background: #dcfce7;
  color: #16a34a;
}

.parts-count.low-stock {
  background: #fef3c7;
  color: #d97706;
}

.parts-count.out-of-stock {
  background: #fecaca;
  color: #dc2626;
}

@media (max-width: 768px) {
  .info-cards-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .overview-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style> 