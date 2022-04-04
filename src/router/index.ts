import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Main',
    components: {
      default: () => import('../views/pc/Index.vue'),
      tablet: () => import('../views/tablet/Index.vue'),
      mobile: () => import('../views/mobile/Index.vue'),
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
  routes,
})

export default router
