import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './Home.vue'
import Login from './Login.vue'
import Detect from './Detect.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/detect', name: 'detect', component: Detect },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

