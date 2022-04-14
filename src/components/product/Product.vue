<template>
  <MobileHeader title="유료 서비스 이용내역" :cart="false" :back="false" />
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
              <button v-if="item.categoryName !== '프리미엄서비스'">
                연장신청
              </button>
              <button v-else>정기결제 해지</button>
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
          <img src="../../assets/product/recommend_product.png" alt="" />
        </div>
        <div class="move-shop-button">
          <button @click="router.push('/shop')">신청하러가기</button>
        </div>
      </div>
      <!-- 추천 상품 -->
    </div>
  </main>
  <BottomNav />
</template>

<script lang="ts" setup>
import MobileHeader from '../common/MobileHeader.vue'
import BottomNav from '../common/BottomNav.vue'
import { computed, ref } from 'vue'
import { PayStatus, CurrentProduct } from '../../types/pay'
import api from '../../config/axios.config'
import { useStore } from 'vuex'
import { toastAlert } from '../../functions/alert'
import { dateFormat } from '../../functions/commons'
import { useRouter } from 'vue-router'

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

calcDate()
getPayList()
getProductList()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include mobile {
  .product {
    padding: 24px;

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
        margin-top: 12px;
        img {
          width: 100%;
        }
      }

      .move-shop-button {
        margin-top: 24px;

        button {
          width: 100%;
          height: 50px;
          color: #fff;
          font-size: 1.6rem;
          background-color: $primary;
          font-weight: bold;
          border-radius: 5px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
