<template>
  <div class="ad-service">
    <img
      src="../../assets/shop/hotclip.png"
      alt="브랜드 핫클립"
      @click="moveProductPage('브랜드 핫클립')"
    />
    <img
      src="../../assets/shop/brand.png"
      alt="유망브랜드"
      @click="moveProductPage('유망브랜드')"
    />
    <img
      src="../../assets/shop/search.png"
      alt="검색페이지 상위노출"
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

@include mobile {
  .ad-service {
    margin-top: 24px;

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
