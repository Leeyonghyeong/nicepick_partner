<template>
  <!-- mobile -->
  <div class="bottom-cart mobile">
    <div class="select-term-price">
      <div class="top">상품을 선택해주세요(중복선택 불가능)</div>
      <div class="product-item" v-for="item in payTermPrice" :key="item.id">
        <div class="input-zone">
          <input
            v-model="selectProduct"
            type="radio"
            :id="item.id"
            name="product_mobile"
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
  <!-- mobile -->

  <!-- desktop -->
  <div class="bottom-cart desktop">
    <div class="select-term-price">
      <div class="product-item" v-for="item in payTermPrice" :key="item.id">
        <div class="input-zone">
          <label :for="item.id">
            {{ item.payProductName }}({{ item.term }}일)
          </label>
          <input
            v-model="selectProduct"
            type="radio"
            :id="item.id"
            name="product_desktop"
            :value="item"
            @change="changeProduct"
          />
        </div>
        <div class="price-zone">
          <div class="price-zone-item">
            <div>광고기간</div>
            <div>{{ item.term }}일</div>
          </div>
          <div class="price-zone-item">
            <div>
              비용<span
                >(<span v-if="item.sale > 0">{{ item.sale }}% DC, </span
                >부가세포함)</span
              >
            </div>
            <div v-if="item.sale > 0" class="origin">
              {{ calcOriginPrice(item.price, item.sale) }} 원
            </div>
            <div v-else>{{ item.price.toLocaleString() }} 원</div>
            <div class="sale-price" v-if="item.sale > 0">
              {{ item.price.toLocaleString() }} 원
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cart">
      <div class="pay-price">
        <div>선택상품 합계 비용 :</div>
        <div id="price">
          {{ totalPrice.toLocaleString() }}원<span>(부가세포함)</span>
        </div>
      </div>
      <div class="cart-button">
        <button @click="addCart">장바구니</button>
        <button @click="movePay">결제하기</button>
      </div>
    </div>
  </div>
  <!-- desktop -->
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { PayTermPrice } from '../../../types/pay'
import api from '../../../config/axios.config'
import { toastAlert } from '../../../functions/alert'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { calcOriginPrice } from '../../../functions/commons'

defineProps<{
  payTermPrice: PayTermPrice[]
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

@include desktop {
  .bottom-cart {
    margin-top: 100px;
    &.mobile {
      display: none;
    }

    .select-term-price {
      @include pc_container();
      display: flex;
      justify-content: center;
      margin-bottom: 150px;

      .product-item {
        width: 420px;
        height: 260px;
        border: 1px solid #dcdcdc;
        margin: 0 5px;

        .input-zone {
          height: 100px;
          padding: 0 52px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 2.2rem;
          font-weight: 600;
          color: #353535;
          background-color: #f2f4f6;
          box-sizing: border-box;
          border-bottom: 1px solid #dcdcdc;

          input[type='radio'] {
            width: 25px;
            height: 25px;
          }
        }

        .price-zone {
          padding: 45px 52px;

          .price-zone-item {
            position: relative;
            display: flex;
            justify-content: space-between;
            margin-bottom: 13px;
            font-size: 2rem;
            color: #353535;

            div {
              span {
                font-size: 1.2rem;
                color: #777;

                span {
                  color: #fa5252;
                }
              }
            }

            .origin {
              text-decoration: line-through;
              color: #888;
            }

            .sale-price {
              position: absolute;
              right: 0;
              top: 30px;
              color: #fa5252;
            }
          }
        }
      }
    }

    .cart {
      position: sticky;
      bottom: 0;
      background-color: #f3f8ff;
      width: 100%;
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .pay-price {
        display: flex;
        font-size: 2.4rem;
        color: #353535;

        #price {
          margin-left: 10px;
          color: #fa5252;

          span {
            font-size: 1.6rem;
            color: #777;
          }
        }
      }

      .cart-button {
        margin-top: 25px;

        button {
          width: 130px;
          height: 50px;
          background-color: #fff;
          border: 1px solid #fa5252;
          color: #fa5252;
          border-radius: 10px;
          margin: 0 2.5px;
          font-size: 1.8rem;
          cursor: pointer;

          &:last-child {
            color: #fff;
            background-color: #fa5252;
          }
        }
      }
    }
  }
}

@include mobile {
  .bottom-cart {
    position: sticky;
    bottom: 0;

    &.desktop {
      display: none;
    }

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
