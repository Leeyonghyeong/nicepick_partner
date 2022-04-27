<template>
  <MobileHeader title="마이페이지" :cart="false" :back="true" />
  <main>
    <div class="mypage">
      <div class="current-brand-user-info">
        <div class="left-brand">
          {{ brand?.brandName.slice(0, 1) }}
        </div>
        <div class="right-brand-user-info">
          <div class="brand-name">
            <img src="../../assets/mypage/partner.png" alt="partner" />
            {{ brand?.brandName }}
            <span v-if="brand?.isPremium">(프리미엄 서비스)</span>
          </div>
          <div class="user-email">
            {{ store.state.auth.user.email }}
          </div>
        </div>
      </div>

      <div class="mypage-menu">
        <div class="menu-item" @click="router.push('/mypage/user/management')">
          <div>내 정보관리</div>
          <img src="../../assets/mypage/move_arrow.png" alt="arrow" />
        </div>

        <div class="menu-item" @click="router.push('/mypage/change/brand')">
          <div>브랜드 전환</div>
          <img src="../../assets/mypage/move_arrow.png" alt="arrow" />
        </div>

        <div class="menu-item" @click="router.push('/mypage/keyword')">
          <div>대표 키워드 추가</div>
          <img src="../../assets/mypage/move_arrow.png" alt="arrow" />
        </div>

        <div class="menu-item" @click="logout">
          <div>로그아웃</div>
        </div>
      </div>
    </div>
    <Footer />
  </main>
  <BottomNav />
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
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

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

@include mobile {
  .mypage {
    .current-brand-user-info {
      padding: 24px 24px 57px;
      display: flex;
      align-items: center;

      .left-brand {
        font-size: 2.4rem;
        color: #fff;
        background-color: $primary;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        margin-right: 12px;
      }

      .right-brand-user-info {
        line-height: 1.5;
        .brand-name {
          display: flex;
          align-items: center;
          font-size: 1.4rem;
          color: #191919;
          font-weight: bold;

          img {
            width: 20px;
          }

          span {
            color: #fa5252;
          }
        }

        .user-email {
          font-size: 1.2rem;
          color: #767676;
        }
      }
    }

    .mypage-menu {
      padding: 0 24px 94px;
      .menu-item {
        padding: 16px 0;
        border-bottom: 1px solid #ededed;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.4rem;
        color: #191919;

        &:first-child {
          padding-top: 0;
        }

        img {
          width: 20px;
        }
      }
    }
  }
}
</style>
