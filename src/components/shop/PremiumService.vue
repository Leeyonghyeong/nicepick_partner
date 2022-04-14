<template>
  <div class="premium-service" v-if="!isLoading">
    <div class="service-box">
      <div class="top">창업픽 멤버십</div>
      <div class="price">
        <div>
          월
          {{ payProduct?.payTermPrice[0].price.toLocaleString() }}원
        </div>
        <div>한달 0원</div>
      </div>
      <div class="noti">한달 후 정기결제 시작, 언제든 해지가능</div>
      <div class="start-button">
        <button @click="router.push('/pay/premium')">한달 무료 시작하기</button>
      </div>
    </div>

    <div class="intro-image">
      <img src="../../assets/shop/premium_image.png" alt="premium" />
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
        <div>- 한달 무료 이용 혜택은 최초 1회만 제공됩니다.</div>
        <div>
          - 멤버십 비용은 한달 무료 이용(가입일 기준 ~ 한달)이후부터 매 월
          자동결제 됩니다.
        </div>
        <div>- 멤버십 가격은 부가세와 결제 수수료가 포함되어 있습니다.</div>
        <div>
          - 멤버십 결제 비용은 회원님이 선택하신 결제수단으로 구독 기간 마지막
          날에 다음달 멤버십 금액이 청구됩니다.
        </div>
        <div>
          - 해지를 원하실 경우 멤버십 구독 기간이 끝나는 날로부터 최소 24시간
          전에 자동 갱신을 해지해야 합니다.
        </div>
        <div>
          - 자동결제 해지는 [ 기업회원페이지 > 유료 서비스 이용내역 > 결제상 품
          관리 > 해지하기 ]에서 가능합니다. 이 경우 더이상 다음 결제가 이 루어
          지지 않으며, 남은 기간 동안 서비스 이용이 가능합니다.
        </div>
        <div>- 일부 구매 전용 상품은 멤버십으로 이용이 불가능합니다.</div>
        <div>
          - 도움이 필요하시면
          <span style="font-weight: bold; color: #191919">1:1 문의</span>를
          이용해주세요.
        </div>
      </div>
    </div>

    <div class="move-pay-button">
      <button @click="router.push('/pay/premium')">한달 무료 시작하세요</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PayCategory, PayProduct } from '../../types/pay'
import api from '../../config/axios.config'
import { toastAlert } from '../../functions/alert'

const router = useRouter()

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

getPayCategory()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include mobile {
  .premium-service {
    margin-top: 24px;

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
          margin: 6px 0;
          line-height: 1.6;

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
