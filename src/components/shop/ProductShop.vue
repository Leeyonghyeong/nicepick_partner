<template>
  <MobileHeader title="광고 상품 가입" :cart="true" :back="false" />
  <main>
    <div class="shop">
      <div class="shop-top">
        <div
          class="premium"
          :class="{ active: serviceType === 'premium' }"
          @click="serviceType = 'premium'"
        >
          프리미엄 서비스
        </div>
        <div
          class="ad"
          :class="{ active: serviceType === 'ad' }"
          @click="serviceType = 'ad'"
        >
          광고 서비스
        </div>
      </div>

      <PremiumService v-if="serviceType === 'premium'" />
      <AdService v-else-if="serviceType === 'ad'" />
    </div>
  </main>
  <BottomNav />
</template>

<script lang="ts" setup>
import MobileHeader from '../common/MobileHeader.vue'
import BottomNav from '../common/BottomNav.vue'
import PremiumService from './PremiumService.vue'
import AdService from './AdService.vue'
import { ref } from 'vue'

const serviceType = ref<string>('premium')
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include mobile {
  .shop {
    padding: 24px;

    .shop-top {
      display: flex;
      padding: 4px;
      height: 50px;
      width: 100%;
      background-color: #ededed;
      align-items: center;
      justify-content: space-between;
      border-radius: 35px;

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
</style>
