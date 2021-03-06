<template>
  <MobileHeader title="주문/결제" :cart="false" :back="true" />
  <main>
    <div class="pay-product">
      <div class="pay-product-list">
        <div class="top">신청 상품</div>

        <div class="pay-item" v-for="item in getPayList" :key="item.id">
          <div class="name-price item-info">
            <div>{{ item.payProductName }}({{ item.term }}일)</div>
            <div>{{ item.price.toLocaleString() }}원</div>
          </div>
          <div class="noti-origin-price item-info">
            <div>{{ item.payCategoryName }}</div>
            <div class="origin-price">
              {{ calcOriginPrice(item.price, item.sale).toLocaleString() }}원
            </div>
          </div>
        </div>
      </div>

      <div class="pay-info">
        <div class="top">결제 금액</div>
        <div class="info-box">
          <div class="info-item">
            <div>총 선택 상품 금액</div>
            <div>{{ calcOriginTotalPrice(getPayList).toLocaleString() }}원</div>
          </div>
          <div class="info-item">
            <div>총 할인금액</div>
            <div>- {{ calcTotalSale(getPayList).toLocaleString() }}원</div>
          </div>
          <div class="info-item pay-price">
            <div>총 결제금액</div>
            <div>
              {{
                (
                  calcOriginTotalPrice(getPayList) - calcTotalSale(getPayList)
                ).toLocaleString()
              }}원
            </div>
          </div>
        </div>
      </div>

      <div class="agree-zone">
        <div class="all-agree">
          <input
            v-model="isAllCheck"
            type="checkbox"
            id="allCheck"
            @change="allCheck"
          />
          <label for="allCheck">전체 동의하기</label>
        </div>
        <div class="required-agree">
          <div>
            <input
              v-model="isPayAgree"
              type="checkbox"
              id="payAgree"
              @change="allCheckStatus"
            />
            <label for="payAgree">[필수] 주문 및 결제 관련 약관동의</label>
          </div>
          <div>
            <input
              v-model="isRefundAgree"
              type="checkbox"
              id="refundAgree"
              @change="allCheckStatus"
            />
            <label for="refundAgree">환불 정책 동의</label>
            <a
              href="https://nicepick.notion.site/f6319949c3254de0bf1e0196b3561f16"
              target="_blank"
              >보기</a
            >
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </main>
  <div class="pay-button">
    <button @click="pay">
      총 <span>{{ getPayList.length }}</span
      >개 |
      <span>{{
        (
          calcOriginTotalPrice(getPayList) - calcTotalSale(getPayList)
        ).toLocaleString()
      }}</span
      >원 결제하기
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { checkAlert, toastAlert } from '../../functions/alert'
import { PayTermPrice } from '../../types/pay'
import Footer from '../common/Footer.vue'
import MobileHeader from '../common/MobileHeader.vue'
import api from '../../config/axios.config'
import { RequestPayParams, RequestPayResponse } from 'iamport-typings'
import { useRouter } from 'vue-router'
import { SweetAlertResult } from 'sweetalert2'

const store = useStore()
const router = useRouter()

const isAllCheck = ref<boolean>(false)
const isPayAgree = ref<boolean>(false)
const isRefundAgree = ref<boolean>(false)

const payType = ref<string>('card')

const getPayList = computed(() => {
  return store.state.pay.payTermPrice as PayTermPrice[]
})

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

const allCheck = () => {
  if (isAllCheck.value) {
    isPayAgree.value = true
    isRefundAgree.value = true
  } else {
    isPayAgree.value = false
    isRefundAgree.value = false
  }
}

const allCheckStatus = () => {
  if (isPayAgree.value && isRefundAgree.value) {
    isAllCheck.value = true
  } else {
    isAllCheck.value = false
  }
}

const pay = async () => {
  if (!isPayAgree.value || !isRefundAgree.value) {
    checkAlert('동의 항목을 체크해 주시기 바랍니다')
    return
  }

  const merchant_uid = 'nicepick_' + Math.floor(new Date().getTime() / 1000)
  let addPayStatusPayload = []

  for (const termPrice of getPayList.value as PayTermPrice[]) {
    const payloadObject = {
      payProductId: termPrice.payProductId,
      payTermPrice: termPrice,
      brandId: store.state.auth.brandId,
      iamportPayId: merchant_uid,
    }

    addPayStatusPayload.push(payloadObject)
  }

  console.log(addPayStatusPayload)

  const addPayStatus = await api.post('/pay', addPayStatusPayload)

  if (addPayStatus.data.success) {
    const IMP = window.IMP
    IMP?.init('imp46515117') // 내꺼 : imp10145605 회사 : imp46515117

    const params: RequestPayParams = {
      pg: 'danal_tpay',
      pay_method: payType.value,
      merchant_uid: merchant_uid, //상점에서 생성한 고유 주문번호
      name: '창업픽 광고상품',
      amount:
        calcOriginTotalPrice(getPayList.value) -
        calcTotalSale(getPayList.value),
      buyer_email: store.state.auth.user.email,
      buyer_name: store.state.auth.user.userName,
      buyer_tel: store.state.auth.user.phone,
    }

    IMP?.request_pay(params, async (res: RequestPayResponse) => {
      if (res.success) {
        const alert: SweetAlertResult = await checkAlert(
          '결제가 완료 되었습니다.'
        )

        if (alert.isConfirmed) {
          router.push('/product')
        }
      } else {
        const cancelPay = await api.post('/pay/cancel', {
          iamportPayId: res.merchant_uid,
        })

        const result = cancelPay.data

        if (result.success) {
          const alert: SweetAlertResult = await checkAlert(
            '결제가 취소되었습니다.'
          )

          if (alert.isConfirmed) {
            router.push('/shop')
          }
        } else {
          toastAlert(result.errorMessage)
        }
      }
    })
  } else {
    toastAlert(addPayStatus.data.errorMessage)
    router.back()
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include mobile {
  .pay-product {
    background-color: #f8f8fa;
    .pay-product-list {
      background-color: #fff;
      padding: 24px 24px 0;
      .top {
        font-size: 1.8rem;
        color: #191919;
        font-weight: bold;
      }

      .pay-item {
        border: 1px solid #dbdbdb;
        padding: 20px;
        border-radius: 5px;
        margin-top: 12px;

        .item-info {
          display: flex;
          justify-content: space-between;
        }

        .name-price {
          font-size: 1.6rem;
          color: #191919;

          div {
            &:last-child {
              font-weight: bold;
            }
          }
        }

        .noti-origin-price {
          margin-top: 8px;
          font-size: 1.4rem;
          color: #767676;

          .origin-price {
            text-decoration: line-through;
          }
        }
      }
    }

    .pay-info {
      background-color: #fff;
      padding: 40px 24px 20px;

      .top {
        font-size: 1.8rem;
        font-weight: bold;
        color: #191919;
      }

      .info-box {
        margin-top: 12px;
        background-color: #f9f9f9;
        border-radius: 5px;

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          font-size: 1.4rem;
          color: #191919;

          &:first-child {
            padding-top: 16px;
          }

          &:nth-child(2) {
            padding-top: 12px;
            padding-bottom: 12px;
          }
        }

        .pay-price {
          font-size: 1.6rem;
          font-weight: bold;
          background-color: #e8e8e8;
          border-radius: 5px;
          padding: 10px 20px;
        }
      }
    }

    .agree-zone {
      margin-top: 12px;
      background-color: #fff;
      padding: 20px 24px 40px;

      input[type='checkbox'] {
        position: absolute;
        width: 0px;
        height: 0px;
      }

      input[type='checkbox'] + label::before {
        content: '\2713';
        color: #fff;
        width: 2rem;
        height: 2rem;
        background-color: #dcdcdc;
        text-align: center;
        line-height: 2rem;
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

      .all-agree {
        font-size: 1.8rem;
        color: #191919;
        font-weight: bold;
        padding-bottom: 16px;
        border-bottom: 1px solid #ededed;
      }

      .required-agree {
        margin-top: 16px;
        font-size: 1.4rem;
        color: #191919;

        div {
          display: flex;
          justify-content: space-between;

          &:first-child {
            margin-bottom: 12px;
          }

          a {
            color: #767676;
            text-decoration: none;
          }
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
