<template>
  <div class="ad-service">
    <img src="../../assets/shop/hotclip.png" alt="브랜드 핫클립" />
    <img src="../../assets/shop/brand.png" alt="유망브랜드" />
    <img src="../../assets/shop/search.png" alt="검색페이지 상위노출" />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@import '@/scss/main';

@include mobile {
  .ad-service {
    margin-top: 24px;

    img {
      width: 100%;

      &:not(:first-child) {
        margin-top: 20px;
      }
    }
  }
}
</style>
