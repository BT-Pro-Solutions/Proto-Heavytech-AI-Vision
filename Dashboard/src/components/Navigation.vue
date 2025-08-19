<template>
  <div class="navigation">
    <img src="/pointer.svg" alt="pointer" class="pointer" />
    <nav class="nav-menu">
      <div 
        class="nav-item"
        :class="{ active: activeView === 'vehicleInformation' }"
        @click="$emit('navigate', 'vehicleInformation')"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 12 6zm1.5 12h-3v-1.5h1v-5h-1V10h2.5v6.5h.5V18z"/>
        </svg>
      </div>
      <div 
        class="nav-item"
        :class="{ active: activeView === 'aivision' }"
        @click="$emit('navigate', 'aivision')"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M4 7a3 3 0 0 1 3-3h3l2-2h3l2 2h3a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7zm8 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/>
        </svg>
      </div>
      <div 
        class="nav-item"
        :class="{ active: activeView === 'maintenance' }"
        @click="$emit('navigate', 'maintenance')"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M22.7 19.3l-6.4-6.4a6 6 0 0 1-7.6-7.6l2.1 2.1 2.1-2.1-2.1-2.1a6 6 0 0 1 7.6 7.6l6.4 6.4-2.1 2.1zM4 20a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
        </svg>
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