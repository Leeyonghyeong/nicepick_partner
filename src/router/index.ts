import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'SignIn',
    component: () => import('../views/auth/SignIn.vue'),
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../views/auth/SignUp.vue'),
  },
  {
    path: '/management',
    name: 'BrandManagement',
    component: () => import('../views/management/BrandManagement.vue'),
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('../views/product/Product.vue'),
  },
  {
    path: '/shop',
    name: 'ProductShop',
    component: () => import('../views/shop/ProductShop.vue'),
  },
  {
    path: '/pay/premium',
    name: 'PremiumPay',
    component: () => import('../views/pay/PremiumPay.vue'),
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
