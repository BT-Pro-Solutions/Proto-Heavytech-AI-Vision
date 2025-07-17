<template>
  <div class="navigation">
    <img src="/pointer.svg" alt="pointer" class="pointer" />
    <nav class="nav-menu">
      <div 
        class="nav-item"
        :class="{ active: activeView === 'vehicleInformation' }"
        @click="$emit('navigate', 'vehicleInformation')"
      >
        <Icon icon="ci:info" />
      </div>
      <div 
        class="nav-item"
        :class="{ active: activeView === 'aivision' }"
        @click="$emit('navigate', 'aivision')"
      >
        <Icon icon="tabler:camera-ai" />
      </div>
      <div 
        class="nav-item"
        :class="{ active: activeView === 'maintenance' }"
        @click="$emit('navigate', 'maintenance')"
      >
        <Icon icon="prime:wrench" />
      </div>
    </nav>
  </div>
</template>

<script setup>
defineProps({
  activeView: {
    type: String,
    default: 'vehicleInformation'
  }
})

defineEmits(['navigate'])
</script>

<style scoped>
.pointer {
  position: absolute;
  top: 50%;
  left: -19px;
  transform: translateY(-50%);
}

.navigation {
  height: 100%;
  background: var(--color-background-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px 0 0 30px;
  position: relative;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nav-item {
  background: var(--color-surface);
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 5px;
  font-family: var(--font-body);
  transition: background-color 0.2s;
  color: #ccc;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: .2s;
  svg {
    width: 32px;
    height: 32px;
  }
}

.nav-item:hover {
  color: #fff;
}

.nav-item.active {
  box-shadow: inset 0 0 0 2px var(--color-primary), 0 0 10px var(--color-primary-transparent);
  color: var(--color-primary);
}
</style> 