<template>
  <div class="aivision">
    <Header>
      <template #title>
        AI VISION
      </template>
      <template #subtitle>
        Front End Loader
      </template>
    </Header>
    <div class="aivision-content">
      <div class="aivision-content-3d">
        <!-- 3d model here -->
      </div>
      <div class="aivision-content-info">
        <Card>
          <!--data values here-->
        </Card>
        <div class="aivision-video">
          <!-- video here -->
          <div class="aivision-video-title">
            <div>AI VISION</div>
            <div class="aivision-video-title-details">
              60FPS | Training Active
            </div>
          </div>
        </div>
      </div>
    </div>
    
    
  </div>
</template>

<script setup>
import Header from './Header.vue';
</script>

<style scoped>
.aivision {
  background: var(--color-background-dark);
}
</style> 