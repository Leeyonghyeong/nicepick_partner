<template>
  <main>
    <div class="signin-box">
      <div class="main-image">
        <img src="../../../assets/signin/main.jpg" alt="main-image" />
      </div>
      <div class="signin-zone">
        <div class="signin-top-title">브랜드 관리자 로그인</div>
        <div class="signin-input-box">
          <div class="input-zone">
            <input
              v-model="email"
              type="text"
              placeholder="이메일 입력"
              ref="emailRef"
            />
            <input
              v-model="password"
              type="password"
              placeholder="비밀번호(영문+숫자+특수문자 8~16자)"
              ref="passwordRef"
              @keypress.enter="signinSubmit"
            />
          </div>
          <div class="signin-button">
            <button @click="signinSubmit">로그인</button>
          </div>
        </div>
        <div class="find-password" @click="router.push('/findpw')">
          비밀번호 찾기
        </div>
        <div class="signup-button">
          <button @click="router.push('/signup')">회원가입</button>
        </div>
        <div class="event-text">
          첫기업 대상 프리미엄 멤버십 30일 무료 체험 !
        </div>
      </div>
    </div>

    <div class="brand-logo-box">
      <img
        v-if="!checkMobile"
        src="../../../assets/signin/brand_list.png"
        alt="brand_list"
      />
      <img
        v-else
        src="../../../assets/signin/mobile_brand_list.png"
        alt="brand_list"
      />
    </div>

    <div class="noti-qna">
      <div class="noti">
        <div class="top" @click="showNoti = !showNoti">
          <div>공지사항</div>
          <div><i class="fa-solid fa-plus"></i></div>
        </div>
        <div class="list" :class="{ show: showNoti }">
          <div class="item">- 모바일 서비스 리뉴얼 개편</div>
          <div class="item">- 3월 시스템 점검 실시</div>
          <div class="item">
            - [이벤트] 첫기업 고객 프리미엄 멤버십 30일 무료
          </div>
        </div>
      </div>
      <div class="qna">
        <div class="top" @click="showQna = !showQna">
          <div>Q&A</div>
          <div><i class="fa-solid fa-plus"></i></div>
        </div>
        <div class="list" :class="{ show: showQna }">
          <div class="item">- 비밀번호를 잃어버렸어요 어떻게 하나요?</div>
          <div class="item">- 사업자등록 번호 수정은 어디서 하나요?</div>
          <div class="item">- 결제는 어떻게 하나요?</div>
        </div>
      </div>
      <div class="app">
        <div class="left">
          <div>APP 다운로드</div>
          <div>언제 어디서나 창업정보를</div>
          <div>확인하세요</div>
        </div>
        <div class="right">
          <img src="../../../assets/signin/app_icon.png" alt="icon" />
        </div>
      </div>
    </div>
  </main>
  <Footer v-if="!checkMobile" />
</template>

<script lang="ts" setup>
import Footer from '../../common/Footer.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { toastAlert } from '../../../functions/alert'
import api from '../../../config/axios.config'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const checkMobile = ref<boolean>(false)
const showNoti = ref<boolean>(false)
const showQna = ref<boolean>(false)

const email = ref<string>('')
const emailRef = ref<HTMLInputElement>()
const password = ref<string>('')
const passwordRef = ref<HTMLInputElement>()

const checkWidth = () => {
  if (window.innerWidth < 765) {
    checkMobile.value = true
  } else {
    checkMobile.value = false
  }
}

const signinSubmit = async () => {
  if (!email.value) {
    toastAlert('이메일을 입력해 주세요')
    emailRef.value?.focus()
    return
  } else if (!password.value) {
    toastAlert('비밀번호를 입력해 주세요')
    passwordRef.value?.focus()
    return
  }

  const result = await api.post('/auth/signin', {
    email: email.value,
    password: password.value,
    role: 'COMPANY',
  })

  if (result.data.success) {
    const accessToken = result.data.accessToken
    const user = result.data.user
    const brandId = result.data.brandId

    localStorage.setItem('accessToken', accessToken)

    const userData = {
      id: user.id,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    }

    store.commit('auth/updateState', {
      user: userData,
      isLogin: true,
      brandId,
    })

    router.push('/management')
  } else {
    toastAlert(result.data.errorMessage)

    if (result.data.errorMessage.includes('비밀번호')) {
      passwordRef.value?.focus()
    } else {
      emailRef.value?.focus()
    }
  }
}

checkWidth()

onMounted(() => {
  window.addEventListener('resize', checkWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkWidth)
})
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  .signin-box {
    @include pc-container();
    margin-top: 30px;
    display: flex;
    justify-content: space-between;

    .main-image {
      img {
        width: 845px;
      }
    }

    .signin-zone {
      width: 380px;
      height: 500px;
      background-color: #f3f8ff;
      padding: 0 20px;

      .signin-top-title {
        margin-top: 48px;
        font-size: 2rem;
        color: #191919;
      }

      .signin-input-box {
        margin-top: 40px;
        display: flex;

        .input-zone {
          flex-grow: 0.6;
          display: flex;
          flex-direction: column;

          input {
            width: 100%;
            padding: 0 10px;
            height: 65px;
            border: 1px solid #e8e8e8;
            font-size: 1.6rem;

            &:last-child {
              margin-top: -1px;
            }
          }
        }

        .signin-button {
          flex-grow: 0.4;

          button {
            width: 100%;
            height: 100%;
            background: $primary;
            font-size: 1.8rem;
            color: #fff;
            cursor: pointer;
          }
        }
      }

      .find-password {
        font-size: 1.4rem;
        color: #999;
        padding: 6px;
        cursor: pointer;
      }

      .signup-button {
        display: flex;
        margin-top: 90px;

        button {
          cursor: pointer;
          background-color: #fff;
          border: 1px solid $primary;
          width: 100%;
          height: 50px;
          color: $primary;
          font-size: 2rem;
        }
      }

      .event-text {
        margin-top: 14px;
        display: flex;
        justify-content: center;
        font-size: 1.6rem;
        color: #444;
      }
    }
  }

  .brand-logo-box {
    @include pc-container();
    margin-top: 30px;
  }

  .noti-qna {
    @include pc-container();
    display: flex;
    margin-top: 35px;
    margin-bottom: 45px;

    .noti,
    .qna,
    .app {
      width: calc(100% / 3);
      padding: 20px 30px;
      .top {
        display: flex;
        justify-content: space-between;
        font-size: 2rem;
        color: #191919;

        div {
          &:last-child {
            color: #888;
            cursor: pointer;
          }
        }
      }

      .list {
        margin-top: 17px;
        font-size: 1.6rem;
        color: #888;
        line-height: 2;

        .item {
          margin-bottom: 5px;
          cursor: pointer;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .qna {
      border-left: 1px solid #bebebe;
      border-right: 1px solid #bebebe;
      box-sizing: border-box;
    }

    .app {
      padding: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        div {
          font-size: 1.6rem;
          color: #888;
          line-height: 1.25;

          &:first-child {
            cursor: pointer;
            font-size: 2.6rem;
            color: #191919;
            margin-bottom: 7px;
          }
        }
      }

      .right {
        img {
          width: 108px;
        }
      }
    }
  }
}

@include tablet {
  .signin-box {
    width: 100%;

    .main-image {
      width: 100%;
      img {
        width: 100%;
      }
    }

    .signin-zone {
      background-color: #f3f8ff;
      padding: 30px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      .signin-top-title {
        font-size: 2rem;
        color: #191919;
        margin-bottom: 16px;
      }

      .signin-input-box {
        display: flex;

        .input-zone {
          flex-grow: 1;
          display: flex;
          flex-direction: column;

          input {
            width: 100%;
            height: 65px;
            border: 1px solid #e8e8e8;
            font-size: 1.6rem;
            padding: 0 10px;

            &:last-child {
              margin-top: -1px;
            }
          }
        }

        .signin-button {
          button {
            background-color: $primary;
            height: 100%;
            color: #fff;
            width: 100px;
            font-size: 1.8rem;
          }
        }
      }

      .find-password {
        margin-top: 10px;
        font-size: 1.4rem;
        color: #999;
        cursor: pointer;
      }

      .signup-button {
        margin-top: 20px;

        button {
          width: 100%;
          cursor: pointer;
          height: 50px;
          background-color: #fff;
          color: $primary;
          border: 1px solid $primary;
          font-size: 2rem;
        }
      }

      .event-text {
        font-size: 1.6rem;
        color: #444;
        text-align: center;
        margin-top: 5px;
      }
    }
  }

  .brand-logo-box {
    margin-top: 25px;
    width: 100%;

    img {
      width: 100%;
    }
  }

  .noti-qna {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;

    .noti,
    .qna {
      width: 50%;
      padding: 20px;
      box-sizing: border-box;

      .top {
        font-size: 1.8rem;
        display: flex;
        justify-content: space-between;

        div {
          &:last-child {
            color: #888;
            cursor: pointer;
          }
        }
      }

      .list {
        margin-top: 17px;
        line-height: 2;

        .item {
          font-size: 1.4rem;
          color: #888;
          cursor: pointer;
        }
      }
    }

    .app {
      background-color: #f6f6f6;
      height: 210px;
      margin-top: 20px;
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;

      .left {
        margin-right: 120px;
        div {
          font-size: 2rem;
          color: #888;

          &:first-child {
            font-size: 3.2rem;
            color: #191919;
            margin-bottom: 22px;
            cursor: pointer;
          }
        }
      }

      .right {
        img {
          width: 158px;
        }
      }
    }
  }
}

@include mobile {
  .signin-box {
    width: 100%;

    .main-image {
      img {
        width: 100%;
      }
    }

    .signin-zone {
      box-sizing: border-box;
      background-color: #f3f8ff;
      padding: 25px 24px 20px 24px;

      .signin-top-title {
        font-size: 1.8rem;
        color: #191919;
        margin-bottom: 14px;
      }

      .signin-input-box {
        .input-zone {
          input {
            width: 100%;
            height: 50px;
            font-size: 1.6rem;
            padding: 0 10px;
            border: 1px solid #e8e8e8;

            &:last-child {
              margin-top: -1px;
            }
          }
        }

        .signin-button {
          width: 100%;

          button {
            width: 100%;
            height: 50px;
            color: #fff;
            background-color: $primary;
            font-size: 2rem;
            font-weight: 500;
          }
        }
      }

      .find-password {
        display: flex;
        justify-content: center;
        margin-top: 1.4rem;
        font-size: 1.2rem;
        color: #999;
      }

      .signup-button {
        margin-top: 25px;

        button {
          width: 100%;
          height: 50px;
          background-color: #fff;
          color: $primary;
          border: 1px solid $primary;
          font-size: 2rem;
        }
      }

      .event-text {
        display: flex;
        justify-content: center;
        margin-top: 5px;
        font-size: 1.4rem;
        color: #444;
      }
    }
  }

  .brand-logo-box {
    width: 100%;
    img {
      width: 100%;
    }
  }

  .noti-qna {
    margin-top: 1px;
    .noti,
    .qna {
      .top {
        padding: 14px 24px;
        display: flex;
        justify-content: space-between;
        border: 1px solid #dcdcdc;
        font-size: 1.5rem;
        color: #191919;
        box-sizing: border-box;
        position: relative;
        z-index: 1;

        div {
          &:last-child {
            color: #888;
          }
        }
      }

      .list {
        height: 0;
        opacity: 0;
        transition: all 0.4s;

        &.show {
          height: 126px;
          opacity: 1;

          .item {
            display: block;
          }
        }

        .item {
          height: 0;
          display: none;
          padding: 14px 24px;
          font-size: 1.4rem;
        }
      }
    }

    .qna {
      margin-top: -1px;
    }

    .app {
      display: none;
    }
  }
}
</style>
