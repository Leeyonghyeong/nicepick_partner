<template>
  <MobileHeader title="장바구니" :cart="false" :back="true" />
  <Header />
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

      <div class="cart-header">
        <div class="header-item product-name">상품명</div>
        <div class="header-item pay-price">결제금액</div>
        <div class="header-item cart-delete">상품삭제</div>
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
              <div class="price-sale-price">
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
          <div class="origin-price">
            {{ calcOriginTotalPrice(checkCartList).toLocaleString() }}원
          </div>
        </div>
        <div class="pay-info">
          <div>할인예상금액</div>
          <div class="sale-price">
            - {{ calcTotalSale(checkCartList).toLocaleString() }}원
          </div>
        </div>
        <div class="pay-info">
          <div class="bold">총 주문금액</div>
          <div class="pay-price">
            {{
              (
                calcOriginTotalPrice(checkCartList) -
                calcTotalSale(checkCartList)
              ).toLocaleString()
            }}원
          </div>
        </div>
      </div>

      <div class="cart-noti">
        <div class="noti">
          <div>- 장바구니 상품은 <span>최대30일간</span> 저장됩니다.</div>
          <div>
            - 가격, 옵션 등 정보가 변경된 경우 주문이 불가할 수 있습니다.
          </div>
        </div>

        <div class="pay-button">
          <button @click="movePay">
            총 <span>{{ checkCartList.length }}</span
            >개 |
            <span>{{
              (
                calcOriginTotalPrice(checkCartList) -
                calcTotalSale(checkCartList)
              ).toLocaleString()
            }}</span
            >원
          </button>
        </div>
      </div>
    </div>
  </main>
  <Footer />
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
import Header from '../common/Header.vue'
import Footer from '../common/Footer.vue'
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

@include desktop {
  .cart {
    input[type='checkbox'] {
      position: absolute;
      width: 0px;
      height: 0px;
    }

    input[type='checkbox'] + label::before {
      content: '\2713';
      color: #fff;
      font-weight: bold;
      width: 20px;
      height: 20px;
      background: #dcdcdc;
      text-align: center;
      line-height: 1.6rem;
      border-radius: 50%;
      font-size: 1.6rem;
      display: inline-block;
      margin-right: 12px;
    }

    input[type='checkbox']:checked + label::before {
      content: '\2713';
      color: #fff;
      font-weight: bold;
      background: $primary;
    }
    .cart-top {
      @include pc-container();
      margin-top: 40px;
      padding-left: 100px;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      .all-check {
        display: flex;
        align-items: center;
        font-size: 1.4rem;

        color: #353535;
      }

      .check-delete {
        margin-left: 20px;
        font-size: 1.4rem;
        margin-bottom: 3px;
        color: #9b9b9b;
        cursor: pointer;
      }
    }

    .cart-header {
      @include pc-container();
      height: 40px;
      display: flex;
      align-items: center;
      background-color: #f9f9f9;
      margin-top: 22px;
      padding-left: 132px;
      box-sizing: border-box;

      .header-item {
        text-align: center;
        font-size: 1.8rem;
        color: #353535;

        &.product-name,
        &.pay-price {
          width: 400px;
        }

        &.cart-delete {
          width: 348px;
        }
      }
    }

    .cart-body {
      @include pc-container();

      .cart-list {
        .no-content {
          width: 100%;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.6rem;
          color: #353535;
        }

        .cart-item {
          display: flex;
          align-items: center;
          height: 80px;
          border-bottom: 1px solid #ececec;
          box-sizing: border-box;

          &:last-child {
            border-bottom: none;
          }

          .left-input-check {
            padding-left: 100px;
          }

          .right-cart-info {
            display: flex;
            align-items: center;

            .price-sale-price {
              .cart-info {
                display: flex;
                font-size: 1.6rem;
                color: #353535;
                line-height: 1.3;

                div {
                  width: 400px;
                  text-align: center;
                }

                &.noti-origin {
                  font-size: 1.4rem;
                  color: #959595;

                  .origin-price {
                    text-decoration: line-through;
                  }
                }
              }
            }
            .button {
              width: 348px;
              display: flex;
              justify-content: center;
              align-items: center;

              button {
                width: 70px;
                height: 35px;
                background-color: #fff;
                border: 1px solid #c9c9c9;
                cursor: pointer;
                border-radius: 10px;
                font-size: 1.4rem;
                color: #888;
              }
            }
          }
        }
      }
    }

    .cart-bottom {
      @include pc-container();
      height: 80px;
      border-width: 1px 0 1px 0;
      border-style: solid;
      border-color: #c8c8c8;
      display: flex;
      align-items: center;
      padding: 0 220px;
      box-sizing: border-box;
      background-color: #f9f9f9;

      .pay-info {
        font-size: 2rem;
        color: #353535;
        display: flex;
        align-items: center;

        div {
          &:last-child {
            font-weight: bold;
          }
        }

        .origin-price {
          display: flex;
          align-items: center;
          margin-left: 20px;

          &::after {
            content: '';
            background-image: url('../../assets/shop/plus.png');
            width: 28px;
            height: 28px;
            margin: 0 20px;
          }
        }

        .sale-price {
          color: #fa5252;
          margin-left: 20px;
          display: flex;
          align-items: center;

          &::after {
            content: '';
            background-image: url('../../assets/shop/result.png');
            width: 28px;
            height: 28px;
            margin: 0 20px;
          }
        }

        .pay-price {
          color: $primary;
          margin-left: 20px;
        }
      }
    }

    .cart-noti {
      @include pc-container();
      display: flex;
      justify-content: space-between;
      padding-left: 92px;
      box-sizing: border-box;
      margin-top: 40px;
      margin-bottom: 150px;

      .noti {
        line-height: 1.5;
        div {
          font-size: 1.4rem;
          color: #767676;

          span {
            color: $primary;
          }
        }
      }

      .pay-button {
        display: block;

        button {
          width: 400px;
          height: 60px;
          background-color: #fa5252;
          color: #fff;
          font-size: 1.8rem;
          border-radius: 10px;
          cursor: pointer;

          span {
            font-weight: bold;
          }
        }
      }
    }
  }

  .pay-button {
    display: none;
  }
}

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

    .cart-header {
      display: none;
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

      .pay-button {
        display: none;
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

  footer {
    display: none;
  }
}
</style>
