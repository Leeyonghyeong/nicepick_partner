<template>
  <header>
    <div class="header">
      <div class="header-title">{{ title }}</div>
      <img
        v-if="cart"
        class="cart"
        src="../../assets/shop/cart.png"
        alt="cart"
        @click="router.push('/cart')"
      />
      <img
        v-if="back"
        class="back"
        src="../../assets/back.png"
        alt="back"
        @click="router.back()"
      />
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

defineProps<{
  title: string
  cart: boolean
  back: boolean
}>()

const router = useRouter()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  header {
    display: none;
  }
}

@include tablet {
  header {
    display: none;
  }
}

@include mobile {
  header {
    height: 60px;
    position: sticky;
    top: 0;
    z-index: 999;
    background-color: #fff;
    .header {
      height: 100%;
      border-bottom: 1px solid #ededed;
      box-sizing: border-box;
      @include flex-center();
      position: relative;

      .header-title {
        font-size: 2rem;
        color: #191919;
      }

      .cart {
        position: absolute;
        right: 30px;
        width: 20px;
        cursor: pointer;
      }

      .back {
        position: absolute;
        left: 30px;
        cursor: pointer;
        width: 28px;
      }
    }
  }
}
</style>
