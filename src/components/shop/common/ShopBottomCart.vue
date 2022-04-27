<template>
  <div class="bottom-cart">
    <div class="select-term-price">
      <div class="top">상품을 선택해주세요(중복선택 불가능)</div>
      <div class="product-item" v-for="item in payTermPrice" :key="item.id">
        <div class="input-zone">
          <input
            v-model="selectProduct"
            type="radio"
            :id="item.id"
            name="product"
            :value="item"
            @change="changeProduct"
          />
          <label :for="item.id">
            {{ item.payProductName }}({{ item.term }}일)
          </label>
        </div>
        <div class="price-zone">
          <span>{{ item.price.toLocaleString() }}</span> 원
        </div>
      </div>
    </div>
    <div class="pay-price">
      <div>선택상품 합계 비용</div>
      <div id="price">
        {{ totalPrice.toLocaleString() }}원<span>(부가세포함)</span>
      </div>
    </div>
    <div class="cart-button">
      <button @click="addCart">장바구니</button>
      <button @click="movePay">결제하기</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { PayProduct, PayTermPrice } from '../../../types/pay'
import api from '../../../config/axios.config'
import { toastAlert } from '../../../functions/alert'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

defineProps<{
  payTermPrice: PayTermPrice[]
  payProduct: PayProduct | undefined
}>()

const store = useStore()
const router = useRouter()

const selectProduct = ref<PayTermPrice>()
const totalPrice = ref<number>(0)

const changeProduct = () => {
  if (selectProduct.value) {
    totalPrice.value = selectProduct.value?.price

    store.commit('pay/updateState', {
      payTermPrice: [],
    })

    const payTermPrice = store.state.pay.payTermPrice as PayTermPrice[]

    const index = payTermPrice.findIndex(
      (e) => e.payProductId === selectProduct.value?.payProductId
    )

    if (index > -1) {
      payTermPrice.splice(index, 1)

      payTermPrice.push(selectProduct.value)

      store.commit('pay/updateState', {
        payTermPrice,
      })
    } else {
      payTermPrice.push(selectProduct.value)

      store.commit('pay/updateState', {
        payTermPrice,
      })
    }
  }
}

const addCart = async () => {
  if (!selectProduct.value) {
    toastAlert('상품을 선택해 주세요')
    return
  }

  const checkCart = await api.get(
    `pay/cart/${store.state.auth.brandId}/${selectProduct.value.payProductId}`
  )

  if (checkCart.data.success) {
    if (checkCart.data.isExist) {
      toastAlert('같은 상품은 장바구니에 하나만 담을 수 있습니다')
      return
    }
  } else {
    toastAlert(checkCart.data.errorMessage)
    return
  }

  const result = await api.post('/pay/cart', {
    brandId: store.state.auth.brandId,
    payTermPriceId: selectProduct.value.id,
    payProductId: selectProduct.value.payProductId,
  })

  if (result.data.success) {
    toastAlert('장바구니에 상품이 담겼습니다')
  } else {
    toastAlert(result.data.errorMessage)
  }
}

const movePay = () => {
  if (!selectProduct.value) {
    toastAlert('결제 할 상품을 선택해 주세요')
    return
  } else {
    router.push('/pay/product')
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include mobile {
  .bottom-cart {
    position: sticky;
    bottom: 0;

    .select-term-price {
      background-color: #fff;
      .top {
        height: 30px;
        padding: 0 24px;
        background-color: #f6f6f6;
        display: flex;
        align-items: center;
        font-size: 1.4rem;
        color: #767676;
      }

      .product-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 45px;
        padding: 0 24px;
        font-size: 1.4rem;
        color: #191919;

        &:last-child {
          border-top: 1px solid #ededed;
        }

        label {
          margin-left: 7px;
        }

        .price-zone {
          span {
            font-weight: bold;
          }
        }
      }
    }

    .pay-price {
      display: flex;
      padding: 0 24px;
      height: 50px;
      align-items: center;
      justify-content: space-between;
      font-size: 1.6rem;
      color: #191919;
      background-color: #fff;
      border-top: 1px solid #dbdbdb;

      #price {
        color: #fa5252;
        font-weight: bold;
        font-size: 1.4rem;

        span {
          font-weight: normal;
          color: #999;
        }
      }
    }

    .cart-button {
      display: flex;

      button {
        flex: 1 1 0;
        height: 50px;
        font-size: 1.6rem;
        background-color: #fff;
        border: 1px solid #fa5252;
        color: #fa5252;
        cursor: pointer;

        &:last-child {
          font-weight: bold;
          background-color: #fa5252;
          color: #fff;
          border: none;
        }
      }
    }
  }
}
</style>
