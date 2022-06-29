<template>
  <MobileHeader title="브랜드 관리" :cart="false" :back="false" />
  <Header />
  <!-- mobile menu tab -->
  <div class="m-menu-tab">
    <div @click="router.push('/management')">브랜드 관리</div>
    <div class="active">브랜드 정보수정</div>
  </div>
  <main v-if="!isLoading">
    <div class="brand-change-status">
      <div class="title">
        <div>가맹점 증감현황</div>
        <div class="noti">(최근3년 현황)</div>
      </div>
      <div class="table">
        <div class="table-top">
          <div id="year">연도</div>
          <div><span id="newCount"></span>신규개점</div>
          <div><span id="terminationCount"></span>계약종료</div>
          <div><span id="cancelCount"></span>계약해지</div>
          <div><span id="changeCount"></span>명의변경</div>
        </div>
        <div class="table-body">
          <div class="table-item" v-for="(year, i) in recentYear" :key="year">
            <div class="item">
              <div>{{ year }}년</div>
              <div>
                <input
                  v-model="changeNewCount[i]"
                  type="number"
                  placeholder="숫자 입력"
                /><span>개</span>
              </div>
              <div>
                <input
                  v-model="changeTerminationCount[i]"
                  type="number"
                  placeholder="숫자 입력"
                /><span>개</span>
              </div>
              <div>
                <input
                  v-model="changeCancelCount[i]"
                  type="number"
                  placeholder="숫자 입력"
                /><span>개</span>
              </div>
              <div>
                <input
                  v-model="changeChangeCount[i]"
                  type="number"
                  placeholder="숫자 입력"
                /><span>개</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="franchise-sales">
      <div class="franchise">
        <div class="title">
          <div>연도별 매장현황</div>
          <div class="noti">(최근 3년 현황)</div>
        </div>

        <div class="table">
          <div class="table-top">
            <div id="year">연도</div>
            <div>가맹점 및 직영점 수</div>
          </div>

          <div class="table-body">
            <div class="table-item" v-for="(year, i) in recentYear" :key="year">
              <div class="item">
                <div>{{ year }}년</div>
                <div>
                  <input
                    v-model="franchiseAllCount[i]"
                    type="number"
                    placeholder="숫자 입력"
                  /><span>개</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="sales">
        <div class="title">
          <div>평균 매출현황</div>
          <div class="noti">(최근년도)</div>
        </div>

        <div class="table">
          <div class="table-top">
            <div id="year">연도</div>
            <div>전체 평균 매출</div>
          </div>

          <div class="table-body">
            <div class="table-item">
              <div class="item">
                <div>2022년</div>
                <div>
                  <input type="number" placeholder="숫자 입력" /><span>원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>

    <div class="start-cost">
      <div class="title">
        <div>창업비용</div>
      </div>

      <div class="table">
        <div class="table-body">
          <div class="table-item">
            <div class="item">
              <div>가맹비</div>
              <div>
                <input
                  v-model="membershipFee"
                  type="number"
                  placeholder="숫자 입력"
                /><span>원</span>
              </div>
            </div>
            <div class="item">
              <div>교육비</div>
              <div>
                <input
                  v-model="educationFee"
                  type="number"
                  placeholder="숫자 입력"
                /><span>원</span>
              </div>
            </div>
            <div class="item">
              <div>보증금</div>
              <div>
                <input
                  v-model="deposit"
                  type="number"
                  placeholder="숫자 입력"
                /><span>원</span>
              </div>
            </div>
            <div class="item">
              <div>기타비용</div>
              <div>
                <input
                  v-model="etcFee"
                  type="number"
                  placeholder="숫자 입력"
                /><span>원</span>
              </div>
            </div>
            <div class="item">
              <div>인테리어</div>
              <div>
                <input
                  v-model="interiorFee"
                  type="number"
                  placeholder="숫자 입력"
                /><span>원</span>
              </div>
            </div>
            <div class="line"></div>
            <div class="item">
              <div>합계</div>
              <div>
                <input
                  v-model="startTotalPrice"
                  type="number"
                  placeholder="숫자 입력"
                /><span>원</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="check-change">
      <input v-model="isUpdate" type="checkbox" id="isChange" />
      <label for="isChange"
        >해당 체크박스 미 선택시 내용을 업데이트 하면 정보공개서의 내용이 다시
        덮어 씌워질 수 있으니, 정보공개서 내용 업데이트를 희망하지 않으시는
        브랜드는 해당 체크박스를 선택해 주시기 바랍니다.</label
      >
    </div>

    <div class="submit">
      <div @click="submit">저장</div>
    </div>
  </main>
  <BottomNav />
  <Footer />
</template>

<script lang="ts" setup>
import Header from '../common/Header.vue'
import Footer from '../common/Footer.vue'
import MobileHeader from '../common/MobileHeader.vue'
import BottomNav from '../common/BottomNav.vue'
import api from '../../config/axios.config'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import {
  BrandChangeStatus,
  BrandFranchiseStatus,
  BrandStartCost,
} from '../../types/brand'
import { checkAlert } from '../../functions/alert'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const nowYear = new Date().getFullYear()

const recentYear = ref<number[]>([nowYear, nowYear - 1, nowYear - 2])

// 가맹점 증감 현황
const changeNewCount = ref<number[]>([0, 0, 0])
const changeTerminationCount = ref<number[]>([0, 0, 0])
const changeCancelCount = ref<number[]>([0, 0, 0])
const changeChangeCount = ref<number[]>([0, 0, 0])

// 연도별 매장 현황
const franchiseAllCount = ref<number[]>([0, 0, 0])

// 창업비용
const membershipFee = ref<string>('')
const educationFee = ref<string>('')
const deposit = ref<string>('')
const etcFee = ref<string>('')
const interiorFee = ref<string>('')
const startTotalPrice = ref<string>('')

// 정보공개서 업데이트 허용 여부
const isUpdate = ref<boolean>(false)

const isLoading = ref<boolean>(true)

const brandId = computed(() => {
  return store.state.auth.brandId as string
})

const getBrandInfo = async () => {
  isLoading.value = true

  const getBrand = await api.get('/brand/detail/' + brandId.value)

  if (getBrand.data.success) {
    isUpdate.value = !getBrand.data.brand.isUpdate
  }

  const brandChangeStatus = await api.get(
    '/brand/detail/change/' + brandId.value
  )

  if (brandChangeStatus.data.success) {
    const _brandChangeStatus: BrandChangeStatus[] =
      brandChangeStatus.data.brandChangeStatus

    _brandChangeStatus.sort((a, b) =>
      a.year > b.year ? -1 : a.year < b.year ? 1 : 0
    )

    for (const item of _brandChangeStatus) {
      for (let i = 0; i < recentYear.value.length; i++) {
        if (item.year === recentYear.value[i]) {
          changeNewCount.value[i] = item.newShopCount
          changeTerminationCount.value[i] = item.terminationCount
          changeCancelCount.value[i] = item.cancelCount
          changeChangeCount.value[i] = item.changeCount
        }
      }
    }
  }

  const brandFranchiseStatus = await api.get(
    '/brand/detail/franchise/' + brandId.value
  )

  if (brandFranchiseStatus.data.success) {
    const _brandFranchiseStatus: BrandFranchiseStatus[] =
      brandFranchiseStatus.data.brandFranchiseStatus.filter(
        (e: BrandFranchiseStatus) => e.location === '전체'
      )

    _brandFranchiseStatus.sort((a, b) =>
      a.year > b.year ? -1 : a.year < b.year ? 1 : 0
    )

    for (const item of _brandFranchiseStatus) {
      for (let i = 0; i < recentYear.value.length; i++) {
        if (item.year === recentYear.value[i]) {
          franchiseAllCount.value[i] = item.allCount
        }
      }
    }
  }

  const brandStartCost = await api.get('/brand/detail/start/' + brandId.value)

  if (brandStartCost.data.success) {
    const _brandStartCost: BrandStartCost = brandStartCost.data.brandStartCost

    membershipFee.value = (
      parseInt(_brandStartCost.membershipFee.replaceAll(',', '')) * 1000
    ).toString()
    educationFee.value = (
      parseInt(_brandStartCost.educationFee.replaceAll(',', '')) * 1000
    ).toString()
    deposit.value = (
      parseInt(_brandStartCost.deposit.replaceAll(',', '')) * 1000
    ).toString()
    etcFee.value = (
      parseInt(_brandStartCost.etcFee.replaceAll(',', '')) * 1000
    ).toString()
    interiorFee.value = (
      parseInt(_brandStartCost.interiorFee.replaceAll(',', '')) * 1000
    ).toString()
    startTotalPrice.value = (
      parseInt(_brandStartCost.startTotalPrice.replaceAll(',', '')) * 1000
    ).toString()
  }

  isLoading.value = false
}

const submit = async () => {
  // const sendBrandChangeStatus = await api.post('brand/detail/change/', {
  //   brandId: brandId.value,
  //   changeYear: recentYear.value,
  //   changeNewCount: changeNewCount.value,
  //   changeTerminationCount: changeTerminationCount.value,
  //   changeCancelCount: changeCancelCount.value,
  //   changeChangeCount: changeChangeCount.value,
  // })

  // if (!sendBrandChangeStatus.data.success) {
  //   checkAlert('가맹점 증감현황 변경에 실패 했습니다')
  //   return
  // }

  // const sendBrandFranchiseStatus = await api.post('brand/detail/franchise', {
  //   brandId: brandId.value,
  //   franchiseYear: recentYear.value,
  //   franchiseAllCount: franchiseAllCount.value,
  // })

  // if (!sendBrandFranchiseStatus.data.success) {
  //   checkAlert('연도별 매장현황 변경에 실패 했습니다')
  //   return
  // }

  // const member = parseInt(membershipFee.value) / 1000
  // const edu = parseInt(educationFee.value) / 1000
  // const depo = parseInt(deposit.value) / 1000
  // const etc = parseInt(etcFee.value) / 1000
  // const interior = parseInt(interiorFee.value) / 1000
  // const total = member + edu + depo + etc

  // startTotalPrice.value = ((total + interior) * 1000).toString()

  // const sendBrandStartCost = await api.post('brand/detail/start', {
  //   brandId: brandId.value,
  //   membershipFee: member.toLocaleString(),
  //   educationFee: edu.toLocaleString(),
  //   deposit: depo.toLocaleString(),
  //   etcFee: etc.toLocaleString(),
  //   interiorFee: interior.toLocaleString(),
  //   totalFee: total.toLocaleString(),
  //   startTotalPrice: (parseInt(startTotalPrice.value) / 1000).toLocaleString(),
  // })

  // if (!sendBrandStartCost.data.success) {
  //   checkAlert('창업비용 변경에 실패 했습니다')
  //   return
  // }

  const sendBrandIsUpdate = await api.post('/brand/detail', {
    brandId: brandId.value,
    isUpdate: !isUpdate.value,
  })

  if (!sendBrandIsUpdate.data.success) {
    checkAlert('정보공개서 업데이트 허용여부 변경에 실패 했습니다')
    return
  }

  checkAlert('내용이 변경 되었습니다')
}

getBrandInfo()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  .m-menu-tab {
    display: none;
  }

  main {
    @include pc-container();
    .title {
      width: 170px;
      background-color: #f3f8ff;
      display: flex;
      flex-direction: column;
      height: 100%;
      padding-left: 30px;
      justify-content: center;
      box-sizing: border-box;
      line-height: 1.6rem;

      div {
        font-size: 1.6rem;
        color: #353535;

        &.noti {
          font-size: 1.2rem;
        }
      }
    }

    .table {
      .table-top {
        display: flex;
        height: 84px;
        padding: 40px 0 20px 0;
        box-sizing: border-box;
        font-size: 1.6rem;

        div {
          width: 220px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .table-body {
        .table-item {
          .item {
            display: flex;
            margin-bottom: 12px;

            div {
              width: 220px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 1.6rem;
              color: #353535;
              position: relative;

              input {
                width: 210px;
                height: 40px;
                border: 1px solid #cfcfcf;
                box-sizing: border-box;
                padding-right: 25px;
                font-size: 1.6rem;
                text-align: right;
                display: flex;

                &::placeholder {
                  color: #c7c7c7;
                }
              }

              span {
                position: absolute;
                top: 10px;
                right: 20px;
              }
            }
          }
        }
      }
    }
    .brand-change-status {
      height: 268px;
      display: flex;
      border-bottom: 1px solid #eee;

      .table {
        .table-top {
          div {
            span {
              width: 14px;
              height: 14px;
              border-radius: 50%;
              margin-right: 4px;

              &#newCount {
                background-color: #fe7b95;
              }

              &#terminationCount {
                background-color: #56b3ff;
              }

              &#cancelCount {
                background-color: #ffd651;
              }

              &#changeCount {
                background-color: #52c2c2;
              }
            }
          }
        }
      }
    }

    .franchise-sales {
      height: 268px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eee;

      .franchise {
        display: flex;
      }

      .sales {
        display: flex;
        align-items: center;
      }
    }

    .start-cost {
      height: 400px;
      border-bottom: 1px solid #eee;
      margin-bottom: 18px;
      display: flex;

      .table {
        padding-top: 40px;

        .table-body {
          .table-item {
            .item {
              &:last-child {
                div {
                  input {
                    color: $primary;
                  }
                }
              }

              div {
                &:first-child {
                  padding-left: 85px;
                  box-sizing: border-box;
                  justify-content: flex-start;
                }
              }
            }
          }
        }

        .line {
          border-top: 1px solid #cfcfcf;
          margin: 16px 0;
          width: 350px;
          margin-left: 85px;
        }
      }
    }

    .check-change {
      display: flex;
      align-items: center;
      padding-left: 30px;

      label {
        font-size: 1.2rem;
        color: #353535;
        margin-left: 5px;
      }

      input[type='checkbox'] {
        width: 16px;
        height: 16px;
      }
    }

    .submit {
      display: flex;
      justify-content: center;
      margin-bottom: 80px;
      margin-top: 20px;

      div {
        width: 400px;
        height: 50px;
        background-color: $primary;
        border-radius: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 2rem;
        cursor: pointer;
      }
    }
  }
}

@include mobile {
  .m-menu-tab {
    display: flex;

    div {
      height: 60px;
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.8rem;
      color: #767676;
      box-sizing: border-box;
      border-bottom: 1px solid #ededed;
      &.active {
        color: $primary;
        border-bottom: 3px solid $primary;
        font-weight: bold;
      }
    }
  }

  main {
    .title {
      display: flex;
      align-items: flex-end;
      padding: 24px 0;

      div {
        font-size: 1.8rem;
        color: #353535;
        font-weight: bold;

        &.noti {
          font-size: 1.4rem;
          font-weight: normal;
        }
      }
    }

    .brand-change-status {
      padding: 0 24px 40px;
      border-bottom: 7px solid #f8f8fa;

      .table {
        display: flex;
        justify-content: space-between;
        .table-top {
          font-size: 1.4rem;
          color: #191919;
          width: 20vw;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;

          #year {
            display: none;
          }

          div {
            display: flex;
            align-items: center;
            height: 50px;
            align-items: center;

            &:not(:first-child) {
              margin-bottom: 7px;
            }

            span {
              margin-right: 3.5px;
              width: 13px;
              height: 13px;
              border-radius: 50%;

              &#newCount {
                background-color: #fe7b95;
              }

              &#terminationCount {
                background-color: #56b3ff;
              }

              &#cancelCount {
                background-color: #ffd651;
              }

              &#changeCount {
                background-color: #52c2c2;
              }
            }
          }
        }

        .table-body {
          display: flex;
          width: 65vw;

          .table-item {
            width: calc(100% / 3);
            .item {
              font-size: 1.4rem;
              color: #191919;

              div {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                height: 50px;

                &:not(:first-child) {
                  margin-bottom: 7px;
                  margin-left: 7px;
                }

                input {
                  box-sizing: border-box;
                  border: 1px solid #ededed;
                  border-radius: 5px;
                  height: 50px;
                  font-size: 1.6rem;
                  width: 100%;
                  text-align: right;
                  padding: 0 20px;

                  &::placeholder {
                    font-size: 1rem;
                  }
                }

                span {
                  position: absolute;
                  right: 8px;
                }
              }
            }
          }
        }
      }
    }

    .franchise-sales {
      padding: 0 24px 40px;
      border-bottom: 7px solid #f8f8fa;

      .table {
        display: flex;
        justify-content: space-between;
        .table-top {
          font-size: 1.4rem;
          color: #191919;
          width: 20vw;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;

          #year {
            display: none;
          }

          div {
            display: flex;
            align-items: center;
            height: 50px;
            align-items: center;

            &:not(:first-child) {
              margin-bottom: 7px;
            }
          }
        }

        .table-body {
          display: flex;
          width: 65vw;

          .table-item {
            width: calc(100% / 3);
            .item {
              font-size: 1.4rem;
              color: #191919;

              div {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                height: 50px;

                &:not(:first-child) {
                  margin-bottom: 7px;
                  margin-left: 7px;
                }

                input {
                  box-sizing: border-box;
                  border: 1px solid #ededed;
                  border-radius: 5px;
                  height: 50px;
                  font-size: 1.6rem;
                  width: 100%;
                  text-align: right;
                  padding: 0 20px;

                  &::placeholder {
                    font-size: 1rem;
                  }
                }

                span {
                  position: absolute;
                  right: 8px;
                }
              }
            }
          }
        }
      }
    }

    .start-cost {
      padding: 0 24px 40px;
      border-bottom: 7px solid #f8f8fa;

      .table {
        .table-body {
          .table-item {
            .item {
              display: flex;
              justify-content: space-between;

              &:not(:first-child) {
                margin-top: 7px;
              }

              &:last-child {
                margin-top: 12px;
                border-top: 1px solid #ededed;
                padding-top: 12px;

                div {
                  input {
                    color: $primary;
                  }
                }
              }

              div {
                font-size: 1.4rem;
                color: #191919;
                height: 50px;
                display: flex;
                align-items: center;

                &:first-child {
                  width: 20vw;
                }

                &:last-child {
                  width: 65vw;
                  position: relative;

                  input {
                    width: 100%;
                    border: 1px solid #ededed;
                    border-radius: 5px;
                    height: 50px;
                    padding: 0 25px;
                    text-align: right;
                    font-size: 1.6rem;
                  }

                  span {
                    position: absolute;
                    right: 8px;
                  }
                }
              }
            }
          }
        }
      }
    }

    .check-change {
      margin-top: 24px;
      padding: 0 24px;
      display: flex;

      label {
        margin-left: 8px;
        font-size: 1.3rem;
        color: #191919;
        line-height: 16px;
      }
    }

    .submit {
      padding: 24px;

      div {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: $primary;
        color: #fff;
        font-size: 1.6rem;
        font-weight: bold;
        height: 50px;
        border-radius: 5px;
      }
    }
  }

  footer {
    display: none;
  }
}
</style>
