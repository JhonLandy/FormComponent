import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/Vue2Compoent',
    name: 'Vue2Compoent',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Vue2Compoent/index.vue')
  },
  {
    path: '/Vue3Compoent',
    name: 'Vue3Compoent',
    component: () => import(/* webpackChunkName: "about" */ '../views/Vue3Compoent/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
