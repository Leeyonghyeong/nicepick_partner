import {
  createRouter,
  createWebHistory,
  NavigationGuard,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router'
import { toastAlert } from '../functions/alert'
import store from '../store'
import api from '../config/axios.config'

const checkPremiumUser: NavigationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const brandId = store.state.auth.brandId

  const result = await api.get(`/brand/detail/${brandId}`)

  if (result.data.success) {
    if (result.data.brand.isPremium) {
      next()
    } else {
      toastAlert('프리미엄 서비스 가입을 하셔야 이용하실 수 있습니다')
      next(from.fullPath)
    }
  } else {
    next(from.fullPath)
  }
}

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
    path: '/findpw',
    name: 'FindPW',
    component: () => import('../views/auth/FindPW.vue'),
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
    path: '/shop/ad/:id',
    name: 'AdProduct',
    component: () => import('../views/shop/AdProduct.vue'),
  },
  {
    path: '/pay/premium',
    name: 'PremiumPay',
    component: () => import('../views/pay/PremiumPay.vue'),
  },
  {
    path: '/pay/product',
    name: 'ProductPay',
    component: () => import('../views/pay/ProductPay.vue'),
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/cart/Cart.vue'),
  },
  {
    path: '/mypage',
    name: 'MyPage',
    component: () => import('../views/mypage/MyPage.vue'),
  },
  {
    path: '/mypage/user/management',
    name: 'UserManagement',
    component: () => import('../views/mypage/UserManagement.vue'),
  },
  {
    path: '/mypage/change/brand',
    name: 'ChangeBrand',
    component: () => import('../views/mypage/ChangeBrand.vue'),
  },
  {
    path: '/mypage/keyword',
    name: 'BrandKeyword',
    beforeEnter: checkPremiumUser,
    component: () => import('../views/mypage/BrandKeyword.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')
  const isLogin = store.state.auth.isLogin

  if (
    to.fullPath === '/' ||
    to.fullPath === '/signup' ||
    to.fullPath === '/findpw'
  ) {
    if (token && isLogin) {
      next('/management')
    } else {
      next()
    }
  } else {
    if (token && isLogin) {
      next()
    } else {
      toastAlert('로그인이 필요합니다')
      next('/')
    }
  }
})

export default router
