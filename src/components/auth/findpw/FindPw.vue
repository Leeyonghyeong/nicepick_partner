<template>
  <MobileHeader
    :title="isChangePassword ? '비밀번호 재설정' : '비밀번호 찾기'"
    :cart="false"
    :back="true"
  />
  <Header />
  <main>
    <div class="findpw" v-if="!isChangePassword">
      <div class="noti">
        <div>회원정보의 이메일 주소로 인증을</div>
        <div>통해 비밀번호를 변경할 수 있습니다</div>
      </div>

      <div class="top">비밀번호 찾기</div>

      <div class="input-zone input-zone-mobile">
        <div class="email-input">
          <input
            v-model="email"
            type="text"
            placeholder="이메일 주소 입력"
            @keypress.enter="checkEmail"
          />
          <button @click="checkEmail">전송</button>
        </div>
        <div class="certification-input">
          <input
            v-model="certificationNumber"
            type="text"
            placeholder="인증번호 입력"
            @keypress.enter="checkCertificationNumber"
          />
        </div>
      </div>

      <div class="input-zone input-zone-desktop">
        <div class="email-input">
          <div class="title">이메일 입력</div>
          <div class="input-box">
            <input
              v-model="email"
              type="text"
              placeholder="이메일 주소 입력"
              @keypress.enter="checkEmail"
            />
            <button @click="checkEmail">전송</button>
          </div>
        </div>
        <div class="certification-input">
          <div class="title">인증번호 입력</div>
          <div class="input-box">
            <input
              v-model="certificationNumber"
              type="text"
              placeholder="인증번호 입력"
              @keypress.enter="checkCertificationNumber"
            />
            <button @click="checkCertificationNumber">확인</button>
          </div>
        </div>
      </div>

      <div class="submit-button">
        <button @click="checkCertificationNumber">확인</button>
      </div>
    </div>

    <!-- 비밀번호 재설정 -->
    <div class="change-password" v-else>
      <div class="top">비밀번호 재설정</div>
      <div class="input-zone input-zone-mobile">
        <div class="password-input input">
          <input
            v-model="password"
            type="password"
            placeholder="새 비밀번호 입력(영문+숫자+특수문자 8~16자)"
            @keyup="checkPasswordImg"
          />
          <div class="validation-password">
            <img
              v-if="passwordImgName === 'default'"
              src="../../../assets/signup/default_password.png"
              alt="default_password"
            />
            <img
              v-else-if="passwordImgName === 'danger'"
              src="../../../assets/signup/danger_password.png"
              alt="danger_password"
            />
            <img
              v-else
              src="../../../assets/signup/safe_password.png"
              alt="safe_password"
            />
          </div>
        </div>
        <div class="rePassword-input input">
          <input
            v-model="rePassword"
            type="password"
            placeholder="새 비밀번호 입력(영문+숫자+특수문자 8~16자)"
          />
        </div>
      </div>

      <div class="input-zone input-zone-desktop">
        <div class="password-input input">
          <div class="title">새로운 비밀번호</div>
          <div class="input-box">
            <input
              v-model="password"
              type="password"
              placeholder="새 비밀번호 입력(영문+숫자+특수문자 8~16자)"
              @keyup="checkPasswordImg"
            />
            <div class="validation-password">
              <img
                v-if="passwordImgName === 'default'"
                src="../../../assets/signup/default_password.png"
                alt="default_password"
              />
              <img
                v-else-if="passwordImgName === 'danger'"
                src="../../../assets/signup/danger_password.png"
                alt="danger_password"
              />
              <img
                v-else
                src="../../../assets/signup/safe_password.png"
                alt="safe_password"
              />
            </div>
          </div>
        </div>
        <div class="rePassword-input input">
          <div class="title">새로운 비밀번호 재확인</div>
          <div class="input-box">
            <input
              v-model="rePassword"
              type="password"
              placeholder="새 비밀번호 입력(영문+숫자+특수문자 8~16자)"
            />
            <button @click="modifyPassword">확인</button>
          </div>
        </div>
      </div>

      <div class="submit-button">
        <button @click="modifyPassword">확인</button>
      </div>
    </div>
  </main>
  <Footer />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { checkAlert, toastAlert } from '../../../functions/alert'
import Header from '../../common/Header.vue'
import MobileHeader from '../../common/MobileHeader.vue'
import Footer from '../../common/Footer.vue'
import api from '../../../config/axios.config'
import { SweetAlertResult } from 'sweetalert2'
import { useRouter } from 'vue-router'

const router = useRouter()

const isChangePassword = ref<boolean>(false)

const email = ref<string>('')
const certificationNumber = ref<string>('')

const password = ref<string>('')
const rePassword = ref<string>('')
const passwordImgName = ref<string>('default')

const checkEmail = async () => {
  if (email.value === '') {
    toastAlert('이메일을 입력해 주세요')
    return
  }

  const result = await api.get(`/auth/user/${email.value}`)

  if (result.data === 'Exist') {
    toastAlert('해당 이메일로 인증번호를 전송중입니다', 5000)
    sendEmail()
  } else if (result.data === 'Not Exist') {
    toastAlert('이메일이 존재하지 않습니다')
  } else {
    toastAlert(
      `${result.data}로 가입되어 있는 계정은 비밀번호 찾기가 불가능합니다`
    )
  }
}

const sendEmail = async () => {
  const sendEmail = await api.get(
    `/auth/send/email?email=${email.value}&type=FINDPW`
  )

  if (sendEmail.data.success) {
    toastAlert('인증번호가 이메일로 전송되었습니다')
  } else {
    toastAlert(sendEmail.data.errorMessage)
  }
}

const checkCertificationNumber = async () => {
  const checkResult = await api.get(
    `/auth/verify/number?cerNum=${certificationNumber.value}&email=${email.value}&type=FINDPW`
  )

  if (checkResult.data.success) {
    isChangePassword.value = true
  } else {
    toastAlert(checkResult.data.errorMessage)
  }
}

const checkPasswordImg = () => {
  const regPassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~$@$!%^*#?&()<>_=+])[A-Za-z\d~$@$!%^*#?&()<>_=+]{8,16}$/

  if (!regPassword.test(password.value)) {
    passwordImgName.value = 'danger'
  } else {
    passwordImgName.value = 'safe'
  }
}

const modifyPassword = async () => {
  if (passwordImgName.value !== 'safe') {
    toastAlert('비밀번호가 형식에 맞지 않습니다')
    return
  }

  if (!password.value || !rePassword.value) {
    toastAlert('비밀번호를 입력해 주세요')
    return
  }

  if (password.value !== rePassword.value) {
    toastAlert('비밀번호가 맞지 않습니다')
    return
  }

  if (!email.value) {
    toastAlert('이메일 주소가 올바르지 않습니다')
    return
  }

  const result = await api.patch('/auth/find/password', {
    email: email.value,
    password: password.value,
    rePassword: rePassword.value,
  })

  if (result.data.success) {
    const alert: SweetAlertResult = await checkAlert(
      '비밀번호가 변경 되었습니다'
    )

    if (alert.isConfirmed) {
      router.push('/')
    }
  } else {
    toastAlert('비밀번호 변경에 실패 했습니다')
    password.value = ''
    rePassword.value = ''
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  .findpw,
  .change-password {
    @include pc-container();
    .noti {
      display: none;
    }

    .top {
      padding: 67px 0 11px 15px;
      border-bottom: 1px solid #eee;
      font-size: 2rem;
      color: #353535;
    }

    .input-zone-mobile {
      display: none;
    }

    .input-zone-desktop {
      padding-left: 55px;
      padding-right: 310px;
      margin-top: 40px;
      height: 500px;
      box-sizing: border-box;
      .email-input,
      .certification-input,
      .password-input,
      .rePassword-input {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;

        .title {
          font-size: 1.8rem;
          color: #353535;
        }

        .input-box {
          position: relative;
          display: flex;
          align-items: center;

          input {
            width: 400px;
            height: 50px;
            padding: 0 20px;
            border: 1px solid #cfcfcf;
            background-color: #fff;
          }

          button {
            width: 130px;
            height: 50px;
            color: #fff;
            font-size: 1.8rem;
            border-radius: 10px;
            background-color: $primary;
            margin-left: 11px;
            cursor: pointer;
          }

          .validation-password {
            position: absolute;
            right: 13px;

            img {
              height: 19px;
            }
          }
        }
      }

      .password-input {
        padding-right: 141px;
      }
    }

    .submit-button {
      display: none;
    }
  }
}

@include mobile {
  .findpw {
    .noti {
      padding: 50px 0 40px 0;
      text-align: center;
      font-size: 1.6rem;
      color: #191919;
      line-height: 1.3;
    }

    .top {
      display: none;
    }

    .input-zone-desktop {
      display: none;
    }

    .input-zone {
      padding: 0 24px;

      .email-input {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;

        button {
          width: 60px;
          height: 50px;
          background-color: #fff;
          color: $primary;
          border: 1px solid $primary;
          border-radius: 5px;
          margin-left: 4px;
        }

        input {
          flex: 1 1 0;
        }
      }

      input {
        width: 100%;
        border: none;
        background-color: #f9fcff;
        padding: 0 12px;
        height: 50px;
      }
    }

    .submit-button {
      padding: 40px 24px 0;

      button {
        width: 100%;
        height: 50px;
        background-color: $primary;
        color: #fff;
        font-size: 1.6rem;
        font-weight: bold;
        border-radius: 5px;
      }
    }
  }

  .change-password {
    .top {
      display: none;
    }
    .input-zone {
      padding: 40px 24px 0;

      &.input-zone-desktop {
        display: none;
      }

      .input {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        button {
          width: 60px;
          height: 50px;
          background-color: #fff;
          color: $primary;
          border: 1px solid $primary;
          border-radius: 5px;
          margin-left: 4px;
        }

        input {
          flex: 1 1 0;
        }

        .validation-password {
          position: absolute;
          right: 12px;

          img {
            height: 20px;
          }
        }
      }

      input {
        width: 100%;
        border: none;
        background-color: #f9fcff;
        padding: 0 12px;
        height: 50px;
      }
    }

    .submit-button {
      padding: 40px 24px 0;

      button {
        width: 100%;
        height: 50px;
        background-color: $primary;
        color: #fff;
        font-size: 1.6rem;
        font-weight: bold;
        border-radius: 5px;
      }
    }
  }

  footer {
    display: none;
  }
}
</style>
