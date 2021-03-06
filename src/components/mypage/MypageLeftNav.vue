<template>
  <div class="mypage">
    <div class="current-brand-user-info">
      <div class="left-brand">
        <img :src="brand?.brandLogoImg" :alt="brand?.brandName" />
      </div>
      <div class="right-brand-user-info">
        <div class="brand-name">
          <img src="../../assets/mypage/partner.png" alt="partner" />
          <div>{{ brand?.brandName }}</div>
          <span v-if="brand?.isPremium">(프리미엄 서비스)</span>
        </div>
        <div class="user-email">
          {{ store.state.auth.user.email }}
        </div>
      </div>
    </div>

    <div class="mypage-menu">
      <div
        class="menu-item"
        :class="{ active: route.fullPath === '/mypage/user/management' }"
        @click="router.push('/mypage/user/management')"
      >
        <div>내 정보관리</div>
      </div>

      <div
        class="menu-item"
        :class="{ active: route.fullPath === '/mypage/change/brand' }"
        @click="router.push('/mypage/change/brand')"
      >
        <div>브랜드 전환</div>
      </div>

      <div
        class="menu-item"
        :class="{ active: route.fullPath === '/mypage/keyword' }"
        @click="router.push('/mypage/keyword')"
      >
        <div>대표 키워드 추가</div>
      </div>

      <div class="menu-item" @click="logout">
        <div>로그아웃</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MobileHeader from '../common/MobileHeader.vue'
import Footer from '../common/Footer.vue'
import BottomNav from '../common/BottomNav.vue'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import api from '../../config/axios.config'
import { Brand } from '../../types/brand'
import { toastAlert } from '../../functions/alert'
import { useRoute, useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const route = useRoute()

const brand = ref<Brand>()

const brandId = computed(() => {
  return store.state.auth.brandId
})

const getBrandInfo = async () => {
  const result = await api.get(`/brand/detail/${brandId.value}`)

  if (result.data.success) {
    brand.value = result.data.brand
  } else {
    toastAlert(result.data.errorMessage)
  }
}

const logout = () => {
  localStorage.removeItem('accessToken')

  store.commit('auth/updateState', {
    brandId: '',
    isLogin: false,
    user: {},
  })

  router.push('/')
}

getBrandInfo()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  .mypage {
    width: 315px;

    .current-brand-user-info {
      .left-brand {
        padding: 90px 32px 24px;
        box-sizing: border-box;

        img {
          width: 250px;
          height: 100px;
        }
      }

      .right-brand-user-info {
        line-height: 1.3;
        .brand-name {
          width: 100%;
          font-size: 3.4rem;
          font-weight: bold;
          color: #353535;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;

          div {
            max-width: 250px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }

          img {
            width: 38px;
            margin-right: 10px;
          }

          span {
            font-size: 2rem;
            color: #fa5252;
          }
        }

        .user-email {
          font-size: 2.2rem;
          color: #888;
          text-align: center;
        }
      }
    }

    .mypage-menu {
      margin-top: 100px;

      .menu-item {
        width: 100%;
        height: 64px;
        padding-left: 32px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        font-size: 2.2rem;
        color: #353535;
        cursor: pointer;

        &.active {
          background-color: #f9f9f9;
          font-weight: bold;
        }
      }
    }
  }
}

@include mobile {
  .mypage {
    display: none;
  }
}
</style>
