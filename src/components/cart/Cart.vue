<template>
  <MobileHeader title="장바구니" :cart="false" :back="true" />
  <main>
    <div class="cart">
      <div class="cart-top">
        <div class="all-check">
          <input
            type="checkbox"
            id="cartAllCheck"
            v-model="allCheck"
            @change="cartAllCheck"
          />
          <label class="custom-label" for="cartAllCheck">전체 선택</label>
        </div>
        <div class="check-delete" @click="deleteCheckCart(checkCartList)">
          선택삭제
        </div>
      </div>

      <div class="cart-body">
        <div class="cart-list" v-if="cartList.length === 0">
          <div class="no-content">장바구니에 상품이 없습니다.</div>
        </div>

        <div class="cart-list" v-else>
          <div class="cart-item" v-for="item in cartList" :key="item.id">
            <div class="left-input-check">
              <input
                v-model="checkCartList"
                type="checkbox"
                :id="item.id"
                :value="item"
                @change="allCheckStatus"
              />
              <label :for="item.id" class="custom-label"></label>
            </div>
            <div class="right-cart-info">
              <div class="name-price cart-info">
                <div>{{ item.payProductName }}({{ item.term }}일)</div>
                <div>{{ item.price.toLocaleString() }}원</div>
              </div>

              <div class="noti-origin cart-info">
                <div>({{ item.payCategoryName }})</div>
                <div v-if="item.sale > 0" class="origin-price">
                  {{
                    calcOriginPrice(item.price, item.sale).toLocaleString()
                  }}원
                </div>
              </div>

              <div class="button cart-info">
                <button @click="deleteCart(item.id)">삭제</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-bottom">
        <div class="pay-info">
          <div>총 선택 상품금액</div>
          <div>{{ calcOriginTotalPrice(cartList).toLocaleString() }}원</div>
        </div>
        <div class="pay-info">
          <div>할인예상금액</div>
          <div class="sale-price">
            - {{ calcTotalSale(cartList).toLocaleString() }}원
          </div>
        </div>
        <div class="pay-info">
          <div class="bold">총 주문금액</div>
          <div class="pay-price">
            {{
              (
                calcOriginTotalPrice(cartList) - calcTotalSale(cartList)
              ).toLocaleString()
            }}원
          </div>
        </div>
      </div>

      <div class="cart-noti">
        <div>- 장바구니 상품은 <span>최대30일간</span> 저장됩니다.</div>
        <div>- 가격, 옵션 등 정보가 변경된 경우 주문이 불가할 수 있습니다.</div>
      </div>
    </div>
  </main>
  <div class="pay-button">
    <button @click="movePay">
      총 <span>{{ checkCartList.length }}</span
      >개 |
      <span>{{
        (
          calcOriginTotalPrice(checkCartList) - calcTotalSale(checkCartList)
        ).toLocaleString()
      }}</span
      >원
    </button>
  </div>
</template>

<script lang="ts" setup>
import MobileHeader from '../common/MobileHeader.vue'
import api from '../../config/axios.config'
import { useStore } from 'vuex'
import { toastAlert } from '../../functions/alert'
import { ref } from 'vue'
import { PayTermPrice } from '../../types/pay'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()

const cartList = ref<PayTermPrice[]>([])
const checkCartList = ref<PayTermPrice[]>([])

const allCheck = ref<boolean>(false)

const getCartList = async () => {
  const result = await api.get(`/pay/cart/${store.state.auth.brandId}`)

  if (result.data.success) {
    cartList.value = result.data.payTermPrice
  } else {
    toastAlert(result.data.errorMessage)
  }
}

const calcOriginPrice = (price: number, sale: number): number => {
  const calcSale = 1 - sale / 100

  const originPrice = price / calcSale

  return originPrice
}

const calcOriginTotalPrice = (payTermPrice: PayTermPrice[]): number => {
  let originTotalPrice = 0
  for (const item of payTermPrice) {
    originTotalPrice += calcOriginPrice(item.price, item.sale)
  }

  return originTotalPrice
}

const calcTotalSale = (payTermPrice: PayTermPrice[]): number => {
  let totalSale = 0

  for (const item of payTermPrice) {
    if (item.sale > 0) {
      totalSale += calcOriginPrice(item.price, item.sale) / item.sale
    }
  }

  return totalSale
}

const cartAllCheck = () => {
  if (allCheck.value) {
    checkCartList.value = []
    if (cartList.value) {
      checkCartList.value.push(...cartList.value)

      store.commit('pay/updateState', {
        payTermPrice: checkCartList.value,
      })
    }
  } else {
    checkCartList.value = []

    store.commit('pay/updateState', {
      payTermPrice: checkCartList.value,
    })
  }
}

const allCheckStatus = () => {
  if (checkCartList.value.length !== cartList.value.length) {
    allCheck.value = false

    store.commit('pay/updateState', {
      payTermPrice: checkCartList.value,
    })
  } else {
    allCheck.value = true

    store.commit('pay/updateState', {
      payTermPrice: checkCartList.value,
    })
  }
}

const deleteCheckCart = async (checkCartList: PayTermPrice[]) => {
  if (checkCartList.length === 0) {
    toastAlert('삭제 할 상품을 선택해 주세요')
    return
  }

  const brandId = store.state.auth.brandId

  for (const item of checkCartList) {
    const result = await api.delete('/pay/cart', {
      data: {
        payTermPriceId: item.id,
        brandId,
      },
    })

    if (result.data.success) {
      toastAlert('장바구니에서 상품이 삭제 되었습니다')
    } else {
      toastAlert(result.data.errorMessage)
    }
  }

  getCartList()
}

const deleteCart = async (id: string) => {
  const brandId = store.state.auth.brandId

  const result = await api.delete('/pay/cart', {
    data: {
      payTermPriceId: id,
      brandId,
    },
  })

  if (result.data.success) {
    toastAlert('장바구니에서 상품이 삭제 되었습니다')
    getCartList()
  } else {
    toastAlert(result.data.errorMessage)
  }
}

const movePay = () => {
  if (checkCartList.value.length === 0) {
    toastAlert('결제 할 상품을 선택해 주세요')
    return
  } else {
    router.push('/pay/product')
  }
}

getCartList()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include mobile {
  .cart {
    background-color: #f8f8fa;

    input[type='checkbox'] {
      position: absolute;
      width: 0px;
      height: 0px;
    }
    input[type='checkbox'] + .custom-label::before {
      content: '\2713';
      color: #fff;
      width: 20px;
      height: 20px;
      line-height: 20px;
      background: #fff;
      text-align: center;
      border-radius: 50%;
      font-size: 1.4rem;
      display: inline-block;
      border: 1px solid #dbdbdb;
      margin-right: 8px;
      box-sizing: border-box;
    }

    input[type='checkbox']:checked + .custom-label::before {
      content: '\2713';
      color: #fff;
      font-weight: bold;
      background: $primary;
      border: none;
    }

    .cart-top {
      background-color: #fff;
      width: 100%;
      height: 74px;
      padding: 0 24px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;

      .all-check {
        display: flex;
        align-items: center;
        font-size: 1.8rem;
        color: #191919;
        font-weight: bold;

        input {
          margin-right: 12px;
        }
      }

      .check-delete {
        font-size: 1.4rem;
        color: #767676;
      }
    }

    .cart-body {
      background-color: #fff;
      margin-bottom: 12px;

      .no-content {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.4rem;
        color: #191919;
        height: 100px;
      }
      .cart-list {
        padding: 0 24px;
        .cart-item {
          display: flex;
          align-items: center;
          padding: 24px 0;
          box-sizing: border-box;
          border-bottom: 1px solid #ededed;
          line-height: 1.5;

          &:last-child {
            border-bottom: none;
          }

          .left-input-check {
            width: 40px;
          }

          .right-cart-info {
            flex: 1 1 0;
            .cart-info {
              display: flex;
              justify-content: space-between;
              font-size: 1.6rem;
              color: #191919;
            }

            .name-price {
              div {
                &:last-child {
                  font-weight: bold;
                }
              }
            }

            .noti-origin {
              margin: 4px 0 16px;
              font-size: 1.4rem;
              color: #767676;

              .origin-price {
                text-decoration: line-through;
              }
            }

            .button {
              justify-content: flex-end;

              button {
                cursor: pointer;
                background-color: #fff;
                border: 1px solid #dbdbdb;
                border-radius: 5px;
                width: 150px;
                height: 35px;
                font-size: 1.4rem;
                color: #767676;
              }
            }
          }
        }
      }
    }

    .cart-bottom {
      background-color: #fff;
      padding: 24px;
      margin-bottom: 12px;

      .pay-info {
        display: flex;
        justify-content: space-between;
        font-size: 1.6rem;
        color: #191919;
        margin-bottom: 12px;

        &:last-child {
          margin: 0;
        }

        div {
          &:last-child {
            font-weight: bold;
          }
        }

        .sale-price {
          color: #fa5252;
        }

        .bold {
          font-weight: bold;
        }

        .pay-price {
          color: $primary;
        }
      }
    }

    .cart-noti {
      background-color: #f1f1f5;
      padding: 24px;
      font-size: 1.2rem;
      color: #767676;
      line-height: 1.9;

      div {
        span {
          color: $primary;
        }
      }
    }
  }

  .pay-button {
    position: sticky;
    bottom: 0;

    button {
      width: 100%;
      height: 50px;
      background-color: #fa5252;
      color: #fff;
      font-size: 1.6rem;

      span {
        font-weight: bold;
      }
    }
  }
}
</style>
