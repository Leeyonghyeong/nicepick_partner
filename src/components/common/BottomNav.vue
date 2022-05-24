<template>
  <nav>
    <div class="nav-item" @click="router.push('/management')">
      <img
        v-if="route.path === '/management'"
        src="../../assets/nav/brand_active.png"
        alt="브랜드관리"
      />
      <img v-else src="../../assets/nav/brand.png" alt="브랜드관리" />
    </div>
    <div class="nav-item" @click="router.push('/qna')">
      <img
        v-if="route.path === '/qna'"
        src="../../assets/nav/qna_active.png"
        alt="고객문의"
      />
      <img v-else src="../../assets/nav/qna.png" alt="" />
    </div>
    <div class="nav-item" @click="router.push('/product')">
      <img
        v-if="route.path === '/product'"
        src="../../assets/nav/service_active.png"
        alt="이용서비스"
      />
      <img v-else src="../../assets/nav/service.png" alt="이용서비스" />
    </div>
    <div class="nav-item" @click="router.push('/shop')">
      <img
        v-if="route.path === '/shop'"
        src="../../assets/nav/product_active.png"
        alt="광고상품"
      />
      <img v-else src="../../assets/nav/product.png" alt="광고상품" />
    </div>
    <div class="nav-item" @click="router.push('/mypage')">
      <img src="../../assets/nav/mypage.png" alt="마이페이지" />
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

nav {
  position: sticky;
  z-index: 999;
  bottom: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.08);
  display: flex;
  padding-bottom: 10px;
  box-sizing: border-box;
  align-items: flex-end;
  overflow: hidden;

  .nav-item {
    cursor: pointer;
    width: calc(100% / 5);
    display: flex;
    justify-content: center;

    img {
      width: 112px;
    }
  }
}

@include desktop {
  nav {
    display: none;
  }
}
</style>
