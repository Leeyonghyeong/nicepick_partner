<template>
  <MobileHeader title="프리미엄 서비스 가입" :cart="false" :back="true" />
  <main>
    <div class="premium-service-pay" v-if="!isLoading">
      <div class="service-info">
        <div class="title">{{ productName }}</div>
        <div class="price">
          <div>한달 0원</div>
          <div>{{ price.toLocaleString() }}원</div>
        </div>
      </div>

      <div class="pay-zone">
        <div class="title">결제 금액</div>
        <div class="pay-info-box">
          <div class="service-price">
            <div>멤버십 금액</div>
            <div>
              매월
              {{ price.toLocaleString() }}원
            </div>
          </div>
          <div class="pay-free-term">
            <div>무료 기간</div>
            <div>한달</div>
          </div>
          <div class="pay-price">
            <div>오늘 결제 금액</div>
            <div><span>0</span>원</div>
          </div>
          <div class="next-pay">
            <div>다음 결제</div>
            <div>{{ calcNextMonth() }} ({{ price.toLocaleString() }}원)</div>
          </div>
        </div>
      </div>

      <div class="line"></div>

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

      <div class="notice">
        <div>
          - 무료체험 기간 이후 매월
          <span>구독기간 마지막 날 자동 결제</span> 되며, 언제든 해지
          가능합니다.
        </div>
        <div>
          - 정기 구독(결제) 갱신을 중단하고자 할 경우,
          <span>구독기간 종료 하루 전 구독을 해지</span>하셔야 합니다.
        </div>
        <div>
          - 멤버십 이용 등 기타 문의는 [창업픽 > 고객센터]를 이용해주세요.
        </div>
      </div>
    </div>
  </main>
  <Footer />

  <div class="pay-button">
    <button @click="startFree">0원 결제하기</button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import MobileHeader from '../common/MobileHeader.vue'
import Footer from '../common/Footer.vue'
import { PayCategory } from '../../types/pay'
import api from '../../config/axios.config'
import { toastAlert, checkAlert } from '../../functions/alert'
import { useStore } from 'vuex'
import { RequestPayResponse } from 'iamport-typings'
import { SweetAlertResult } from 'sweetalert2'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const payCategory = ref<PayCategory[]>([])
const price = ref<number>(0)
const productName = ref<string>('')
const isLoading = ref<boolean>(true)

const isAllCheck = ref<boolean>(false)
const isPayAgree = ref<boolean>(false)
const isRefundAgree = ref<boolean>(false)

const brandId = computed(() => {
  return store.state.auth.brandId
})

const getPayCategory = async () => {
  isLoading.value = true
  const result = await api.get('/pay/category')

  if (result.data.success) {
    payCategory.value = result.data.payCategory
    price.value = payCategory.value.find(
      (e) => e.categoryName === '프리미엄서비스'
    )?.payProduct[0].payTermPrice[0].price as number

    productName.value = payCategory.value.find(
      (e) => e.categoryName === '프리미엄서비스'
    )?.payProduct[0].productName as string

    if (payCategory.value) {
      isLoading.value = false
    }
  } else {
    toastAlert(result.data.errorMessage)
  }
}

const calcNextMonth = () => {
  const nowDate = new Date()
  nowDate.setMonth(nowDate.getMonth() + 1)
  const year = nowDate.getFullYear()
  const month = nowDate.getMonth() + 1
  const date = nowDate.getDate()

  return `${year}년 ${month < 10 ? '0' + month : month}월 ${
    date < 10 ? '0' + date : date
  }일`
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

const startFree = async () => {
  if (!isPayAgree.value || !isRefundAgree.value) {
    checkAlert('동의 항목을 체크해 주시기 바랍니다')
    return
  }

  const merchant_uid =
    'nicepick_order_monthly_' + Math.floor(new Date().getTime() / 1000)

  const payProduct = payCategory.value.find(
    (e) => e.categoryName === '프리미엄서비스'
  )?.payProduct[0]

  const payTermPrice = payProduct?.payTermPrice[0]

  const payObject = [
    {
      payProductId: payProduct?.id,
      payTermPrice: payTermPrice,
      brandId: brandId.value,
      iamportPayId: merchant_uid,
    },
  ]

  const addPayStatus = await api.post('/pay', payObject)

  if (addPayStatus.data.success) {
    const IMP = window.IMP
    IMP?.init('imp46515117')

    const params = {
      pg: 'danal_tpay',
      pay_method: 'card',
      merchant_uid: merchant_uid,
      name: '창업픽 정기결제',
      amount: 0,
      customer_uid: brandId.value,
      buyer_email: store.state.auth.user.email,
      buyer_name: store.state.auth.user.userName,
      buyer_tel: store.state.auth.user.phoneNumber,
    }

    IMP?.request_pay(params, async (res: RequestPayResponse) => {
      if (res.success) {
        const firstBillings = await api.post('/pay/billings', {
          customer_uid: brandId.value,
          iamportPayId: merchant_uid,
          buyer_email: store.state.auth.user.email,
          buyer_tel: store.state.auth.user.phoneNumber,
        })

        if (firstBillings.data.success) {
          const confirm: SweetAlertResult = await checkAlert(
            '정기 결제가 정상적으로 등록 되었습니다.\n한 달 후 자동결제가 진행 됩니다.'
          )

          if (confirm.isConfirmed) {
            router.push('/product')
          }
        } else {
          toastAlert(firstBillings.data.errorMessage)
        }
      } else {
        const cancelPay = await api.post('/pay/cancel', {
          iamportPayId: merchant_uid,
        })

        if (cancelPay.data.success) {
          toastAlert('결제가 취소되었습니다')
        } else {
          toastAlert(cancelPay.data.errorMessage)
        }
      }
    })
  } else {
    toastAlert(addPayStatus.data.errorMessage)
  }
}

getPayCategory()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include mobile {
  main {
    min-height: 0;
  }
  .premium-service-pay {
    .service-info {
      margin: 24px 24px 0 24px;
      background-color: #3c3c3c;
      border-radius: 5px;
      padding: 20px;

      .title,
      .price {
        font-size: 2rem;
        color: $primary;
        font-weight: bold;
      }

      .price {
        margin-top: 15px;
        display: flex;
        align-items: flex-end;

        div {
          color: #fff;

          &:last-child {
            font-size: 1.6rem;
            color: #999;
            margin-left: 12px;
            text-decoration: line-through;
          }
        }
      }
    }

    .pay-zone {
      margin: 0 24px 0 24px;
      margin-top: 40px;

      .title {
        font-size: 1.8rem;
        color: #191919;
        font-weight: bold;
      }

      .pay-info-box {
        margin-top: 12px;
        background-color: #f9f9f9;
        border-radius: 5px;

        div {
          font-size: 1.4rem;
          color: #191919;
        }

        .service-price {
          display: flex;
          justify-content: space-between;
          padding: 16px 20px 6px 20px;
        }

        .pay-free-term {
          display: flex;
          justify-content: space-between;
          padding: 6px 20px 12px 20px;
        }

        .pay-price {
          background-color: #e8e8e8;
          border-radius: 5px;
          padding: 12px 20px;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;

          div {
            span {
              font-size: 1.8rem;
              font-weight: bold;
            }

            &:last-child {
              font-weight: normal;
            }
          }
        }

        .next-pay {
          display: flex;
          justify-content: space-between;
          padding: 12px 20px 16px 20px;
        }
      }
    }

    .line {
      width: 100%;
      height: 12px;
      background-color: #f8f8f8;
      margin: 20px 0;
    }

    .agree-zone {
      padding: 0 24px;

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

    .notice {
      margin-top: 40px;
      background-color: #f1f1f5;
      padding: 24px;
      font-size: 1.2rem;
      color: #767676;

      div {
        margin-bottom: 12px;
        line-height: 1.6;

        &:last-child {
          margin: 0;
        }

        span {
          font-weight: bold;
        }
      }
    }
  }

  .pay-button {
    padding: 0 24px;
    margin-bottom: 20px;
    button {
      width: 100%;
      background-color: $primary;
      height: 50px;
      border-radius: 5px;
      color: #fff;
      font-size: 1.6rem;
      font-weight: bold;
    }
  }
}
</style>
