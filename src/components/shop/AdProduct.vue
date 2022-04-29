<template>
  <MobileHeader title="광고 상품 가입" :cart="true" :back="true" />
  <Header />
  <main>
    <!-- mobile -->
    <div class="product mobile">
      <div class="product-noti">
        <div class="title">상품설명</div>
        <div class="noti">
          <div>{{ payProduct?.productNoti }}</div>
          <div v-if="payProduct?.productName === '브랜드 핫클립'">
            <span>(필수)</span>브랜드 정보관리 유튜브 영상 추가
          </div>
          <div v-else>
            <span>(필수)</span>브랜드 정보관리 로고 및 대표이미지 추가
          </div>
        </div>
      </div>

      <div class="product-image">
        <div class="select-image">
          <div
            class="pc-image"
            :class="{ active: isPcImage }"
            @click="isPcImage = true"
          >
            PC 노출위치
          </div>
          <div
            class="mobile-image"
            :class="{ active: !isPcImage }"
            @click="isPcImage = false"
          >
            모바일 노출위치
          </div>
        </div>
        <div class="image">
          <img
            v-if="isPcImage"
            :src="payProduct?.productImg"
            :alt="payProduct?.productName"
          />
          <img
            v-else
            :src="payProduct?.productMobileImg"
            :alt="payProduct?.productName"
          />
        </div>
      </div>

      <div class="product-term-price">
        <div class="product-name">
          {{ payProduct?.productName }}
        </div>

        <div
          class="term-price"
          v-for="item in payProduct?.payTermPrice"
          :key="item.id"
        >
          <div class="term">{{ item.term }} 일</div>
          <div class="price">
            <span id="price">{{ item.price.toLocaleString() }}</span> 원
            <span id="sale" v-if="item.sale > 0">
              <span id="originPrice">
                {{ calcOriginPrice(item.price, item.sale) }} 원
              </span>
              <span>{{ item.sale }}%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- mobile -->

    <!-- desktop -->
    <div class="product desktop">
      <div class="product-noti">
        <div
          class="title"
          :style="{ 'background-color': titleStyleBackgroundColor }"
        >
          {{ payProduct?.productName }}
        </div>
      </div>

      <div class="product-image">
        <div class="select-image">
          <div class="pc-image">PC 노출위치</div>
          <div class="mobile-image">모바일 노출위치</div>
        </div>
        <div class="image">
          <img :src="payProduct?.productImg" :alt="payProduct?.productName" />
          <img
            :src="payProduct?.productMobileImg"
            :alt="payProduct?.productName"
          />
        </div>
      </div>
    </div>
    <!-- desktop -->
  </main>
  <ShopBottomCart
    :payTermPrice="payProduct?.payTermPrice ? payProduct.payTermPrice : []"
  />
  <Footer />
</template>

<script lang="ts" setup>
import MobileHeader from '../common/MobileHeader.vue'
import Header from '../common/Header.vue'
import Footer from '../common/Footer.vue'
import ShopBottomCart from './common/ShopBottomCart.vue'
import { useRoute } from 'vue-router'
import api from '../../config/axios.config'
import { ref } from 'vue'
import { PayProduct } from '../../types/pay'
import { toastAlert } from '../../functions/alert'
import { calcOriginPrice } from '../../functions/commons'

const route = useRoute()

const payProduct = ref<PayProduct>()
const isPcImage = ref<boolean>(true)

const titleStyleBackgroundColor = ref<string>('')

const getSelectPayProduct = async () => {
  const { id } = route.params
  const result = await api.get(`/pay/product/${id}`)

  if (result.data.success) {
    payProduct.value = result.data.payProduct

    if (payProduct.value?.productName === '브랜드 핫클립') {
      titleStyleBackgroundColor.value = '#df4747'
    } else if (payProduct.value?.productName === '유망브랜드') {
      titleStyleBackgroundColor.value = '#3a955f'
    } else {
      titleStyleBackgroundColor.value = '#59aba8'
    }
  } else {
    toastAlert(result.data.errorMessage)
  }
}

getSelectPayProduct()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  .product {
    @include pc-container();
    &.mobile {
      display: none;
    }
    .product-noti {
      margin-top: 85px;
      display: flex;
      justify-content: center;

      .title {
        width: 300px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 40px;
        font-size: 2.8rem;
        color: #fff;
      }
    }

    .product-image {
      margin-top: 85px;

      .select-image {
        display: flex;
        justify-content: center;
        font-size: 2.4rem;
        color: #353535;
        margin-bottom: 42px;

        div {
          width: 300px;
          text-align: center;
          margin: 0 65px;
        }
      }

      .image {
        display: flex;
        justify-content: center;

        img {
          margin: 0 65px;
          width: 300px;
        }
      }
    }
  }
}

@include mobile {
  .product {
    &.desktop {
      display: none;
    }
    .product-noti {
      padding: 24px;
      padding-bottom: 0;
      .title {
        font-size: 1.6rem;
        color: #191919;
        font-weight: bold;
      }

      .noti {
        font-size: 1.4rem;
        color: #191919;
        margin-top: 16px;
        padding-bottom: 40px;
        border-bottom: 1px solid #ededed;
        line-height: 1.6;

        span {
          color: #fa5252;
        }
      }
    }

    .product-image {
      padding: 0 24px;
      margin-top: 40px;

      .select-image {
        display: flex;
        padding: 4px;
        height: 50px;
        width: 100%;
        background-color: #ededed;
        align-items: center;
        justify-content: space-between;
        border-radius: 35px;
        box-sizing: border-box;

        div {
          width: 50%;
          height: 42px;
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

      .image {
        padding-bottom: 40px;
        margin-top: 24px;
        border-bottom: 1px solid #ededed;
        img {
          width: 100%;
        }
      }
    }

    .product-term-price {
      margin-top: 40px;
      padding: 0 24px;
      margin-bottom: 40px;

      .product-name {
        font-size: 1.6rem;
        color: #191919;
        font-weight: bold;

        &::before {
          content: 'HOT | ';
        }
      }

      .term-price {
        font-size: 2.4rem;
        color: #191919;
        margin-top: 16px;
        line-height: 1.15;

        .price {
          #price {
            font-weight: bold;
          }

          #sale {
            font-size: 2rem;
            color: #ff0000;

            #originPrice {
              margin: 0 5px;
              font-size: 1.4rem;
              color: #999;
              text-decoration: line-through;
            }
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
