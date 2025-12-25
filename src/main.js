import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles.css'
import router from './router'
import { useTheme } from './theme'

const app = createApp(App)
useTheme()
app.use(router).mount('#app')
