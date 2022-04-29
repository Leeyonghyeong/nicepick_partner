<template>
  <div class="premium-service" v-if="!isLoading">
    <div class="service-box">
      <div class="top">창업픽 멤버십</div>
      <div class="premium-image">
        <img src="../../assets/shop/premium_service.png" alt="service" />
      </div>
      <div class="price">
        <div>
          월
          {{ payProduct?.payTermPrice[0].price.toLocaleString() }}원
        </div>
        <div>한달 0원</div>
      </div>
      <div class="noti">한달 후 정기결제 시작, 언제든 해지가능</div>
      <div class="start-button">
        <button @click="checkPremiumService">한달 무료 시작하기</button>
      </div>
    </div>

    <div class="intro-image">
      <img
        class="pc"
        src="../../assets/shop/premium_image_pc.png"
        alt="premium"
      />
      <img
        class="mobile"
        src="../../assets/shop/premium_image_mobile.png"
        alt="premium"
      />
    </div>

    <div class="qna">
      <div class="top">자주 묻는 질문</div>
      <div class="qna-list">
        <div class="qna-item">
          <div class="qna-title" @click="qnaShow[0] = !qnaShow[0]">
            <div>프리미엄 서비스를 이용해보고 싶어요</div>
            <div>
              <i v-if="!qnaShow[0]" class="fa-solid fa-angle-down"></i>
              <i v-else class="fa-solid fa-angle-up"></i>
            </div>
          </div>
          <div class="qna-ans" :class="{ active: qnaShow[0] }">
            무료체험을 신청하시면 한달 동안 프리미엄 서비스를 사용해 볼 수
            있습니다.
          </div>
        </div>

        <div class="qna-item">
          <div class="qna-title" @click="qnaShow[1] = !qnaShow[1]">
            <div>카드 결제만 이용할 수 있나요?</div>
            <div>
              <i v-if="!qnaShow[1]" class="fa-solid fa-angle-down"></i>
              <i v-else class="fa-solid fa-angle-up"></i>
            </div>
          </div>
          <div class="qna-ans" :class="{ active: qnaShow[1] }">
            월간 결제는 카드 결제만 지원하고 있습니다.
          </div>
        </div>

        <div class="qna-item">
          <div class="qna-title" @click="qnaShow[2] = !qnaShow[2]">
            <div>세금 계산서를 받을 수 있나요?</div>
            <div>
              <i v-if="!qnaShow[2]" class="fa-solid fa-angle-down"></i>
              <i v-else class="fa-solid fa-angle-up"></i>
            </div>
          </div>
          <div class="qna-ans" :class="{ active: qnaShow[2] }">
            카드 결제 후 매출전표 요청하실 시 본사로 문의하시면 발행해 드립니다.
          </div>
        </div>

        <div class="qna-item">
          <div class="qna-title" @click="qnaShow[3] = !qnaShow[3]">
            <div>정기 결제를 이용하다 해지할 수 있나요?</div>
            <div>
              <i v-if="!qnaShow[3]" class="fa-solid fa-angle-down"></i>
              <i v-else class="fa-solid fa-angle-up"></i>
            </div>
          </div>
          <div class="qna-ans" :class="{ active: qnaShow[3] }">
            정기결제는 요금제 관리 메뉴에서 언제든지 해지할 수 있습니다.
            정기결제를 해지하시면 남은 이용기간 동안 유료 요금제를 이용할 수
            있고 다음 결제 예정일로 부터 정기 결제가 이루어지지 않습니다.
          </div>
        </div>

        <div class="qna-item">
          <div class="qna-title" @click="qnaShow[4] = !qnaShow[4]">
            <div>결제 후 환불 받을 수 있나요?</div>
            <div>
              <i v-if="!qnaShow[4]" class="fa-solid fa-angle-down"></i>
              <i v-else class="fa-solid fa-angle-up"></i>
            </div>
          </div>
          <div class="qna-ans" :class="{ active: qnaShow[4] }">
            사용전이라면 전액 환불가능하며, 이용중이라면 잔여기간을 일할
            계산하여 환불조치됩니다. 환불요청은 고객센터로 문의주시기 바랍니다.
          </div>
        </div>
      </div>
    </div>

    <div class="notice">
      <div class="title">프리미엄 서비스 유의사항</div>
      <div class="notice-list">
        <div>한달 무료 이용 혜택은 최초 1회만 제공됩니다.</div>
        <div>
          멤버십 비용은 한달 무료 이용(가입일 기준 ~ 한달)이후부터 매 월
          자동결제 됩니다.
        </div>
        <div>멤버십 가격은 부가세와 결제 수수료가 포함되어 있습니다.</div>
        <div>
          멤버십 결제 비용은 회원님이 선택하신 결제수단으로 구독 기간 마지막
          날에 다음달 멤버십 금액이 청구됩니다.
        </div>
        <div>
          해지를 원하실 경우 멤버십 구독 기간이 끝나는 날로부터 최소 24시간 전에
          자동 갱신을 해지해야 합니다.
        </div>
        <div>
          자동결제 해지는 [ 기업회원페이지 > 유료 서비스 이용내역 > 결제상 품
          관리 > 해지하기 ]에서 가능합니다. 이 경우 더이상 다음 결제가 이 루어
          지지 않으며, 남은 기간 동안 서비스 이용이 가능합니다.
        </div>
        <div>일부 구매 전용 상품은 멤버십으로 이용이 불가능합니다.</div>
        <div>
          도움이 필요하시면
          <span style="font-weight: bold; color: #191919">1:1 문의</span>를
          이용해주세요.
        </div>
      </div>
    </div>

    <div class="move-pay-button">
      <button @click="checkPremiumService">한달 무료 시작하세요</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PayCategory, PayProduct } from '../../types/pay'
import api from '../../config/axios.config'
import { checkAlert, toastAlert } from '../../functions/alert'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const qnaShow = ref<boolean[]>([false, false, false, false, false])
const payCategory = ref<PayCategory[]>([])
const payProduct = ref<PayProduct>()
const isLoading = ref<boolean>(true)

const getPayCategory = async () => {
  isLoading.value = true
  const result = await api.get('/pay/category')

  if (result.data.success) {
    payCategory.value = result.data.payCategory
    payProduct.value = payCategory.value.find(
      (e) => e.categoryName === '프리미엄서비스'
    )?.payProduct[0]

    if (payCategory.value) {
      isLoading.value = false
    }
  } else {
    toastAlert(result.data.errorMessage)
  }
}

const checkPremiumService = async () => {
  const result = await api.get(`/pay/premium/${store.state.auth.brandId}`)

  if (result.data.success) {
    if (result.data.isPremium) {
      checkAlert('무료서비스를 이미 사용하셨습니다')
      return
    } else {
      router.push('/pay/premium')
    }
  } else {
    toastAlert(result.data.errorMessage)
  }
}

getPayCategory()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  .premium-service {
    margin-top: 90px;

    .service-box {
      text-align: center;

      .top {
        font-size: 2.8rem;
        color: #353535;
      }

      .premium-image {
        margin: 39px 0;
      }

      .price {
        display: flex;
        justify-content: center;

        div {
          font-size: 3rem;
          color: #353535;

          &:last-child {
            font-size: 1.5rem;
            color: #191919;
            background-color: #ededed;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 95px;
            height: 34px;
            margin-left: 6px;
            font-weight: bold;
          }
        }
      }

      .noti {
        font-size: 1.6rem;
        color: #777;
        margin-top: 5px;
      }

      .start-button {
        margin-top: 20px;

        button {
          cursor: pointer;
          width: 400px;
          height: 90px;
          border-radius: 100px;
          background-color: $primary;
          color: #fff;
          font-size: 2.4rem;
        }
      }
    }

    .intro-image {
      margin-top: 100px;
      .mobile {
        display: none;
      }

      img {
        width: 100%;
      }
    }

    .qna {
      margin-top: 220px;
      padding: 99px 0 90px 0;
      background-color: #fbfbfb;

      .top {
        @include pc-container();
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3rem;
        color: #353535;

        &::before {
          content: '';
          background-image: url('../../assets/shop/smile.png');
          width: 44px;
          height: 44px;
          margin-right: 10px;
        }
      }

      .qna-list {
        @include pc-container();
        margin-top: 82px;

        .qna-item {
          margin-bottom: 40px;

          &:last-child {
            margin-bottom: 0;
          }
          .qna-title {
            display: flex;
            font-size: 2.4rem;
            color: #353535;
            font-weight: bold;

            &::before {
              content: 'Q';
              margin-right: 5px;
            }

            i {
              display: none;
            }
          }

          .qna-ans {
            padding-left: 24px;
            font-size: 2.2rem;
            color: #777;
            margin-top: 6px;
          }
        }
      }
    }

    .notice {
      @include pc-container();
      margin-top: 114px;

      .title {
        font-size: 2.3rem;
        color: #353535;
        font-weight: bold;
      }

      .notice-list {
        margin-top: 27px;
        font-size: 2rem;
        color: #777;
        line-height: 1.7;

        div {
          display: flex;

          &::before {
            content: '-';
            margin-right: 5px;
          }
        }
      }
    }

    .move-pay-button {
      @include pc-container();
      margin-top: 126px;
      margin-bottom: 170px;

      button {
        width: 100%;
        height: 100px;
        background-color: $primary;
        border-radius: 100px;
        color: #fff;
        font-size: 3rem;
        cursor: pointer;
      }
    }
  }
}

@include mobile {
  .premium-service {
    margin-top: 24px;
    padding: 0 24px;

    .service-box {
      background-color: #fff;
      box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.16);
      padding: 15px 20px;
      box-sizing: border-box;
      border-radius: 10px;

      .top {
        font-size: 1.4rem;
        color: #191919;
      }

      .premium-image {
        display: none;
      }

      .price {
        margin-top: 30px;
        display: flex;
        align-items: center;

        div {
          font-size: 1.8rem;
          color: #191919;
          font-weight: bold;

          &:last-child {
            margin-left: 20px;
            font-size: 1.2rem;
            background-color: #ededed;
            padding: 4px;
          }
        }
      }

      .noti {
        margin-top: 12px;
        font-size: 1.2rem;
        color: #767676;
      }

      .start-button {
        margin-top: 24px;

        button {
          background-color: $primary;
          font-size: 1.6rem;
          color: #fff;
          width: 100%;
          height: 60px;
          border-radius: 5px;
          cursor: pointer;
        }
      }
    }
    .intro-image {
      margin-top: 40px;
      .pc {
        display: none;
      }

      img {
        width: 100%;
      }
    }

    .qna {
      margin-top: 40px;

      .top {
        font-size: 1.8rem;
        color: #191919;
        font-weight: bold;
      }

      .qna-list {
        margin-top: 12px;

        .qna-item {
          background-color: #f2f2f2;
          border-radius: 5px;

          &:not(:first-child) {
            margin-top: 12px;
          }

          .qna-title {
            display: flex;
            justify-content: space-between;
            padding: 14px 12px;
            font-size: 1.6rem;
            color: #191919;
            font-weight: bold;
          }

          .qna-ans {
            font-size: 1.4rem;
            color: #191919;
            padding: 14px 12px;
            line-height: 1.4;
            display: none;

            &.active {
              display: block;
            }
          }
        }
      }
    }

    .notice {
      margin-top: 40px;
      padding: 20px;
      border-top: 1px solid #ededed;
      border-bottom: 1px solid #ededed;

      .title {
        font-size: 1.4rem;
        color: #191919;
        font-weight: bold;
      }

      .notice-list {
        font-size: 1.2rem;
        color: #767676;

        div {
          display: flex;
          margin: 6px 0;
          line-height: 1.6;

          &::before {
            content: '-';
            margin-right: 5px;
          }

          &:first-child {
            margin-top: 12px;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .move-pay-button {
      margin-top: 40px;

      button {
        width: 100%;
        height: 50px;
        color: #fff;
        background-color: $primary;
        font-size: 1.6rem;
        font-weight: bold;
        border-radius: 35px;
        cursor: pointer;
      }
    }
  }
}
</style>
