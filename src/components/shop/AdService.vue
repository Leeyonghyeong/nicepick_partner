<template>
  <div class="ad-service">
    <img
      src="../../assets/shop/hotclip_mobile.png"
      alt="브랜드 핫클립"
      class="mobile"
      @click="moveProductPage('브랜드 핫클립')"
    />
    <img
      src="../../assets/shop/hotclip_pc.png"
      alt="브랜드 핫클립"
      class="pc"
      @click="moveProductPage('브랜드 핫클립')"
    />
    <img
      src="../../assets/shop/brand_mobile.png"
      alt="유망브랜드"
      class="mobile"
      @click="moveProductPage('유망브랜드')"
    />
    <img
      src="../../assets/shop/brand_pc.png"
      alt="유망브랜드"
      class="pc"
      @click="moveProductPage('유망브랜드')"
    />
    <img
      src="../../assets/shop/search_mobile.png"
      alt="검색페이지 상위노출"
      class="mobile"
      @click="moveProductPage('검색상단 노출')"
    />
    <img
      src="../../assets/shop/search_pc.png"
      alt="검색페이지 상위노출"
      class="pc"
      @click="moveProductPage('검색상단 노출')"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../config/axios.config'
import { toastAlert } from '../../functions/alert'
import { PayProduct } from '../../types/pay'

const router = useRouter()

const product = ref<PayProduct[]>([])

const getProduct = async () => {
  const result = await api.get('/pay/product')

  if (result.data.success) {
    product.value = result.data.payProduct
  } else {
    toastAlert(result.data.errorMessage)
  }
}

const moveProductPage = (productName: string) => {
  const selectProduct: PayProduct = product.value.find(
    (e) => e.productName === productName
  ) as PayProduct

  if (selectProduct) {
    router.push(`/shop/ad/${selectProduct.id}`)
  }
}

getProduct()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  .ad-service {
    @include pc-container();
    margin-top: 130px;
    margin-bottom: 190px;
    display: flex;
    justify-content: space-between;

    .mobile {
      display: none;
    }

    img {
      cursor: pointer;
    }
  }
}

@include mobile {
  .ad-service {
    margin-top: 24px;

    .pc {
      display: none;
    }

    img {
      width: 100%;
      cursor: pointer;

      &:not(:first-child) {
        margin-top: 20px;
      }
    }
  }
}
</style>
