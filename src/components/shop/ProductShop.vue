<template>
  <MobileHeader title="광고 상품 가입" :cart="true" :back="false" />
  <Header />
  <main>
    <div class="shop">
      <div class="shop-top">
        <div class="shop-select">
          <div
            class="premium"
            :class="{ active: serviceType === 'premium' }"
            @click="changeServiceType('premium')"
          >
            프리미엄 서비스
          </div>
          <div
            class="ad"
            :class="{ active: serviceType === 'ad' }"
            @click="changeServiceType('ad')"
          >
            광고 서비스
          </div>
        </div>
      </div>

      <PremiumService v-if="serviceType === 'premium'" />
      <AdService v-else-if="serviceType === 'ad'" />
    </div>
  </main>
  <BottomNav />
  <Footer />
</template>

<script lang="ts" setup>
import MobileHeader from '../common/MobileHeader.vue'
import Header from '../common/Header.vue'
import BottomNav from '../common/BottomNav.vue'
import Footer from '../common/Footer.vue'
import PremiumService from './PremiumService.vue'
import AdService from './AdService.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const serviceType = computed(() => {
  return store.state.pay.serviceType as string
})

const changeServiceType = (type: string) => {
  store.commit('pay/updateState', {
    serviceType: type,
  })
}
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  .shop {
    .shop-top {
      @include pc-container();
      margin-top: 28px;

      .shop-select {
        display: flex;
        .premium,
        .ad {
          flex: 1 1 0;
          height: 107px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2.6rem;
          color: #888;
          background-color: #f5f5f5;
          box-sizing: border-box;
          cursor: pointer;

          &.active {
            border: 1px solid $primary;
            color: $primary;
            background-color: #f3f8ff;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              display: block;
              border-width: 15px 10px 0 10px;
              border-color: #f3f8ff transparent;
              border-style: solid;
              bottom: -14px;
              left: 50%;
              transform: translate(-50%, 0);
              z-index: 1;
            }
            &::before {
              content: '';
              position: absolute;
              display: block;
              border-width: 15px 10px 0 10px;
              border-color: $primary transparent;
              border-style: solid;
              bottom: -16px;
              left: 50%;
              transform: translate(-50%, 0);
              z-index: 0;
            }
          }
        }
      }
    }
  }
}

@include mobile {
  .shop {
    .shop-top {
      margin-top: 24px;
      padding: 0 24px;
      height: 50px;
      width: 100%;
      background-color: #fff;

      box-sizing: border-box;

      .shop-select {
        align-items: center;
        justify-content: space-between;
        display: flex;
        background-color: #ededed;
        border-radius: 35px;
        padding: 4px;

        div {
          width: 50%;
          height: 50px;
          @include flex-center();
          font-size: 1.4rem;
          cursor: pointer;

          &.active {
            background-color: #fff;
            border-radius: 35px;
            box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);
          }
        }
      }
    }
  }

  footer {
    display: none;
  }
}
</style>
