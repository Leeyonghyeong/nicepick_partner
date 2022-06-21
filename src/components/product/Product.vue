<template>
  <MobileHeader title="유료 서비스 이용내역" :cart="false" :back="false" />
  <Header />
  <main>
    <div class="product">
      <!-- 결제내역 조회 -->
      <div class="pay-list">
        <div class="list-top">
          <div class="title">결제내역 조회</div>
          <div class="list-search">
            <select v-model="startYear">
              <option v-for="year in calcYear" :key="year" :value="year">
                {{ year }}년
              </option>
            </select>
            <select v-model="startMonth">
              <option v-for="month in monthArr" :key="month" :value="month">
                {{ month }}월
              </option>
            </select>
            <span>~</span>
            <select v-model="endYear">
              <option v-for="year in calcYear" :key="year" :value="year">
                {{ year }}년
              </option>
            </select>
            <select v-model="endMonth">
              <option v-for="month in monthArr" :key="month" :value="month">
                {{ month }}월
              </option>
            </select>
            <button @click="getPayList">조회</button>
          </div>
        </div>
        <div class="list-header">
          <div class="date">결제일</div>
          <div class="product-name">상품명</div>
          <div class="pay-price">결제금액</div>
          <div class="pay-status">결제상태</div>
        </div>
        <div class="list-body">
          <div class="no-content" v-if="payList.length === 0">
            결제 내역이 없습니다.
          </div>
          <div class="pay-item" v-for="item in payList" :key="item.id">
            <div class="date">
              {{ dateFormat(item.payDate) }}
            </div>
            <div class="info">
              <div>
                {{ item.payTermPrice.payCategoryName }}({{
                  item.payTermPrice.payProductName
                }})
              </div>
              <div>{{ item.payTermPrice.price.toLocaleString() }} 원</div>
              <div v-if="item.status === 1">결제 완료</div>
              <div v-else-if="item.status === 2">결제 취소</div>
              <div v-else>환불</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 결제내역 조회 -->

      <!-- 결제상품 관리 -->
      <div class="product-list">
        <div class="list-top">
          <div class="title">결제상품 관리</div>
        </div>
        <div class="list-header">
          <div class="date">이용기간</div>
          <div class="product-name">상품명</div>
          <div class="pay-price">금액</div>
          <div class="pay-status">선택사항</div>
        </div>
        <div class="list-body" v-if="productList.length === 0">
          <div class="no-content">결제 상품이 없습니다.</div>
        </div>
        <div class="list-body" v-for="item in productList" :key="item.id">
          <div class="product-item">
            <div class="expire-date">
              {{ dateFormat(item.createAt) }} ~ {{ dateFormat(item.expire) }}
            </div>
            <div class="info">
              <div>{{ item.productName }}</div>
              <div>
                {{ item.payStatus.payTermPrice.price.toLocaleString() }} 원
              </div>
            </div>
            <div class="product-button">
              <button
                v-if="item.categoryName !== '프리미엄서비스'"
                @click="extensionProduct(item.payProductId)"
              >
                연장신청
              </button>
              <button v-else @click="bookCancel">정기결제 해지</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 결제상품 관리 -->

      <!-- 추천 상품 -->
      <div class="recommend-product">
        <div class="list-top">
          <div class="title">추천 상품</div>
        </div>
        <div class="recommend-image">
          <img
            class="recommend_pc"
            src="../../assets/product/recommend_product_pc.png"
            alt="추천상품"
          />
          <img
            class="recommend_mobile"
            src="../../assets/product/recommend_product_mobile.png"
            alt="추천상품"
          />
          <div class="move-shop-button">
            <button @click="router.push('/shop')">
              프리미엄 서비스 신청하기
            </button>
          </div>
        </div>

        <div class="new-event">
          <div class="noti">
            <div>창업픽 신규회원 이벤트</div>
            <div>프리미엄 회원가입 시,</div>
            <div>광고서비스 중 택1 무료제공<span>(기간한정)</span></div>
            <div>프리미엄 서비스 가입하시면 개별연락을 드립니다.</div>
          </div>
          <div class="button">
            <div @click="router.push('/shop')">가입하기</div>
          </div>
        </div>
      </div>
      <!-- 추천 상품 -->
    </div>
  </main>
  <Footer />
  <BottomNav />
</template>

<script lang="ts" setup>
import MobileHeader from '../common/MobileHeader.vue'
import Header from '../common/Header.vue'
import BottomNav from '../common/BottomNav.vue'
import Footer from '../common/Footer.vue'
import { computed, ref } from 'vue'
import { PayStatus, CurrentProduct, PayTermPrice } from '../../types/pay'
import api from '../../config/axios.config'
import { useStore } from 'vuex'
import { checkAlert, confirmAlert, toastAlert } from '../../functions/alert'
import { dateFormat } from '../../functions/commons'
import { useRouter } from 'vue-router'
import { SweetAlertResult } from 'sweetalert2'

const router = useRouter()
const store = useStore()

const startYear = ref<number>(0)
const startMonth = ref<number>(1)
const endYear = ref<number>(0)
const endMonth = ref<number>(1)
const monthArr = ref<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

const payList = ref<PayStatus[]>([])
const productList = ref<CurrentProduct[]>([])

const calcYear = computed(() => {
  const nowYear: number = new Date().getFullYear()

  const yearArr: number[] = []

  for (let i = nowYear; i > nowYear - 5; i--) {
    yearArr.push(i)
  }

  return yearArr
})

const calcDate = () => {
  const nowYear: number = new Date().getFullYear()
  const nowMonth: number = new Date().getMonth() + 1

  startYear.value = nowYear
  endYear.value = nowYear
  startMonth.value = nowMonth
  endMonth.value = nowMonth
}

const getPayList = async () => {
  if (startYear.value > endYear.value) {
    toastAlert('시작 년도가 종료 년도보다 큽니다')
    return
  } else {
    if (startYear.value === endYear.value) {
      if (startMonth.value > endMonth.value) {
        toastAlert('시작 월이 종료 월 보다 큽니다')
        return
      }
    }
  }

  const startDate = `${startYear.value}-${startMonth.value}-01`
  const endDate = `${endYear.value}-${endMonth.value + 1}-01`

  const result = await api.get(
    `/pay/list/${store.state.auth.brandId}?startDate=${startDate}&endDate=${endDate}`
  )

  if (result.data.success) {
    payList.value = result.data.payStatus
  } else {
    toastAlert(result.data.errorMessage)
  }
}

const getProductList = async () => {
  const result = await api.get(`/pay/list/product/${store.state.auth.brandId}`)

  if (result.data.success) {
    productList.value = result.data.currentProduct
  } else {
    toastAlert(result.data.errorMessage)
  }
}

const extensionProduct = async (payProductId: string) => {
  const alert: SweetAlertResult = await confirmAlert(
    '연장신청은 30일 단위로 가능합니다. 남은 기간은 결제 완료시 자동으로 연장처리 됩니다.'
  )

  if (alert.isConfirmed) {
    const product = await api.get(`/pay/extension/${payProductId}`)

    const selectTermPrice: PayTermPrice[] = []
    selectTermPrice.push(product.data.payTermPrice)

    store.commit('pay/updateState', {
      payTermPrice: selectTermPrice,
    })

    router.push('/pay/product')
  }
}

const bookCancel = async () => {
  const alert: SweetAlertResult = await confirmAlert(
    '다음 결제 예정일에 결제가 되지 않으며 기간 만료시 상품 해제됩니다.'
  )
  if (alert.isConfirmed) {
    const cancelResult = await api.post('/pay/book/cancel', {
      brandId: store.state.auth.brand,
    })

    if (cancelResult.data.success) {
      checkAlert('자동결제 해지가 정상적으로 처리되었습니다.')
    } else {
      checkAlert(cancelResult.data.errorMessage)
    }
  } else {
    return
  }
}

calcDate()
getPayList()
getProductList()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  .product {
    .pay-list,
    .product-list,
    .recommend-product {
      @include pc-container();
      margin-top: 32px;

      .list-top {
        display: flex;
        justify-content: space-between;

        .title {
          font-size: 1.8rem;
          color: #353535;
          margin-bottom: 17px;
        }

        .list-search {
          select {
            height: 30px;
            width: 100px;
          }

          span {
            margin: 0 10px;
          }

          button {
            height: 30px;
            width: 100px;
            background-color: #f2f4f6;
            border-radius: 10px;
            margin-left: 12px;
            cursor: pointer;
          }
        }
      }

      .list-header {
        display: flex;
        background-color: #f9f9f9;
        height: 40px;
        align-items: center;

        .date,
        .product-name,
        .pay-price,
        .pay-status {
          text-align: center;
          font-size: 1.6rem;
          color: #353535;
        }

        .date {
          width: 200px;
        }

        .product-name {
          width: 500px;
        }

        .pay-price,
        .pay-status {
          width: 290px;
        }
      }

      .list-body {
        .no-content {
          height: 63px;
          text-align: center;
          line-height: 63px;
          border-bottom: 1px solid #ececec;
          font-size: 1.4rem;
          color: #7a7a7a;
          margin-bottom: 100px;
        }

        .pay-item {
          display: flex;
          align-items: center;
          text-align: center;
          font-size: 1.4rem;
          color: #353535;
          height: 50px;
          border-bottom: 1px solid #ececec;

          .date {
            width: 200px;
          }

          .info {
            display: flex;

            div {
              width: 290px;
              &:nth-child(1) {
                width: 500px;
              }
            }
          }
        }

        .product-item {
          display: flex;
          text-align: center;
          align-items: center;
          font-size: 1.4rem;
          color: #353535;
          height: 50px;
          border-bottom: 1px solid #ececec;

          .expire-date {
            width: 200px;
          }

          .info {
            display: flex;

            div {
              width: 290px;
              &:nth-child(1) {
                width: 500px;
              }
            }
          }

          .product-button {
            width: 290px;

            button {
              width: 120px;
              height: 40px;
              background-color: #ededed;
              font-size: 1.4rem;
              color: #191919;
              border-radius: 10px;
              cursor: pointer;
            }
          }
        }
      }

      .recommend-image {
        position: relative;
        width: 1280px;
        display: flex;
        justify-content: center;
        margin: 0 auto;
        margin-top: 28px;

        .recommend_mobile {
          display: none;
        }

        img {
          width: 1148px;
        }

        .move-shop-button {
          position: absolute;
          @include pc-container();
          text-align: center;
          bottom: 70px;

          button {
            width: 400px;
            height: 60px;
            border-radius: 100px;
            font-size: 2rem;
            color: #fff;
            background-color: $primary;
            cursor: pointer;
          }
        }
      }
    }

    .recommend-product {
      width: 100%;

      .title {
        @include pc-container();
      }

      .new-event {
        width: 1012px;
        margin: 20px auto 100px;
        height: 289px;
        background-color: black;
        border-radius: 50px;
        box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.16);
        background-image: linear-gradient(to bottom, #4087f4, #7061f3);
        padding: 53px 90px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;

        .noti {
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          div {
            &:nth-child(1) {
              font-size: 3.6rem;
              font-weight: bold;
              margin-bottom: 28px;
            }

            &:nth-child(2),
            &:nth-child(3) {
              font-size: 2.2rem;
              line-height: 5px;

              span {
                font-size: 1.6rem;
              }
            }

            &:nth-child(4) {
              margin-top: 18px;
              font-size: 1.4rem;
            }
          }
        }

        .button {
          div {
            width: 150px;
            height: 52px;
            background-color: #fff;
            color: #3356b2;
            font-size: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 15px;
            font-weight: bold;
            cursor: pointer;
          }
        }
      }
    }
  }
}

@include mobile {
  .product {
    .pay-list,
    .product-list,
    .recommend-product {
      .list-top {
        .title {
          font-size: 1.8rem;
          color: #191919;
          font-weight: bold;
        }

        .list-search {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          select {
            width: 90px;
            height: 30px;
            border: 1px solid #ededed;
            border-radius: 0;
            color: #191919;
            font-size: 1.4rem;
            background-color: #fff;
          }

          button {
            width: 50px;
            height: 30px;
            border: none;
            font-size: 1.4rem;
            color: #191919;
            cursor: pointer;
          }
        }
      }

      .list-header {
        display: none;
      }

      .list-body {
        margin-top: 30px;
        width: 100%;
        box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.08);
        margin-bottom: 40px;
        border-radius: 5px;

        .no-content {
          height: 100px;
          @include flex-center();
          font-size: 1.4rem;
          color: #191919;
        }

        .pay-item {
          margin: 0 20px;
          padding: 16px 0;
          border-bottom: 1px solid #ededed;
          display: flex;
          align-items: center;

          &:last-child {
            border: none;
          }

          .date {
            font-size: 1.6rem;
            color: #191919;
            margin-right: 20px;
          }

          .info {
            font-size: 1.2rem;
            color: #767676;

            div {
              padding: 2px 0;
              &:first-child {
                font-size: 1.4rem;
                color: #191919;
              }
            }
          }
        }

        .product-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 20px;
          width: 100%;
          box-sizing: border-box;

          .expire-date {
            font-size: 1.6rem;
            color: #191919;
            width: 100%;
            text-align: center;
          }

          .info {
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 1.4rem;
            color: #191919;
            margin: 16px 0 24px 0;
            padding: 0 30px;
            box-sizing: border-box;
          }

          .product-button {
            width: 100%;

            button {
              background-color: #ededed;
              border-radius: 5px;
              height: 40px;
              width: 100%;
              font-size: 1.4rem;
              color: #191919;
              cursor: pointer;
            }
          }
        }
      }
      .recommend-image {
        margin-top: 24px;
        position: relative;

        .recommend_pc {
          display: none;
        }

        img {
          width: 100%;
        }

        .move-shop-button {
          width: 100%;
          display: flex;
          justify-content: center;
          position: absolute;
          bottom: 42px;
          padding: 0 24px;
          box-sizing: border-box;

          button {
            width: 100%;
            height: 50px;
            color: #fff;
            font-size: 1.6rem;
            background-color: $primary;
            font-weight: bold;
            border-radius: 5px;
            cursor: pointer;
            box-sizing: border-box;
          }
        }
      }
    }

    .pay-list {
      padding: 24px 24px 0;
    }

    .product-list {
      padding: 0 24px;
    }

    .recommend-product {
      .list-top {
        padding: 0 24px;
      }
    }

    .new-event {
      margin-top: -1px;
      width: 100%;
      height: 256px;
      padding: 40px 24px 35px;
      box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.16);
      background-image: linear-gradient(to bottom, #4087f4, #7061f3);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .noti {
        color: #fff;

        div {
          &:nth-child(1) {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 10px;
          }

          &:nth-child(2),
          &:nth-child(3) {
            font-size: 1.4rem;
            line-height: 20px;

            span {
              font-size: 1rem;
            }
          }

          &:nth-child(4) {
            margin-top: 15px;
            font-size: 1rem;
          }
        }
      }

      .button {
        div {
          width: 100%;
          background-color: #fff;
          height: 50px;
          border-radius: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.6rem;
          color: #3356b2;
          font-weight: bold;
        }
      }
    }
  }

  footer {
    display: none;
  }
}
</style>
