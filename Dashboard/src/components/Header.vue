<template>
    <header class="header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="header-title">
            <slot name="title">Equipment Name Here</slot>
          </h1>
          <p class="header-subtitle">
            <slot name="subtitle">Vehicle Information</slot>
          </p>
        </div>
        
        <div class="header-controls">
          <div class="power-toggle">
            <Icon icon="ph:power" class="power-icon" />
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                :checked="powerState" 
                @change="handlePowerToggle"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="additional-controls">
            <slot name="controls"></slot>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const powerState = ref(true)
  
  const emit = defineEmits(['power-toggle'])
  
  const handlePowerToggle = (event) => {
    powerState.value = event.target.checked
    emit('power-toggle', powerState.value)
  }
  </script>
  
  <style scoped>
  .header {
    background: var(--color-background-dark, #2a2a2a);
    color: white;
    padding: 2rem 1rem 2rem 0;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 100%;
  }
  
  .header-text {
    flex: 1;
  }
  
  .header-title {
    font-family: var(--font-heading);
    font-size: 2rem;
    font-weight: 400;
    line-height: 1;
    margin: 0;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .header-subtitle {
    font-family: var(--font-body);
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
  }
  
  .header-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .power-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .power-icon {
    width: 20px;
    height: 20px;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
  }
  
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.2);
    transition: 0.3s;
    border-radius: 30px;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
  
  input:checked + .toggle-slider {
    background-color: #4ade80;
    border-color: #4ade80;
  }
  
  input:checked + .toggle-slider:before {
    transform: translateX(30px);
  }
  
  .additional-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  </style>
  