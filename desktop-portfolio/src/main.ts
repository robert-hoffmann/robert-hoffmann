import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/main.css'

createApp(App).mount('#app')
/* Signals that Vue has replaced prerendered shell content. */
document.documentElement.dataset.appMounted = 'true'
