import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Import iconify
import { Icon } from '@iconify/vue'

const app = createApp(App)

// Register iconify globally
app.component('Icon', Icon)

app.mount('#app')
