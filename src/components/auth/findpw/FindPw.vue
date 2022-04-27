<template>
  <MobileHeader
    :title="isChangePassword ? '비밀번호 재설정' : '비밀번호 찾기'"
    :cart="false"
    :back="true"
  />
  <main>
    <div class="findpw" v-if="!isChangePassword">
      <div class="noti">
        <div>회원정보의 이메일 주소로 인증을</div>
        <div>통해 비밀번호를 변경할 수 있습니다</div>
      </div>

      <div class="input-zone">
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

      <div class="submit-button">
        <button @click="checkCertificationNumber">확인</button>
      </div>
    </div>

    <!-- 비밀번호 재설정 -->
    <div class="change-password" v-else>
      <div class="input-zone">
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

      <div class="submit-button">
        <button @click="modifyPassword">확인</button>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { checkAlert, toastAlert } from '../../../functions/alert'
import MobileHeader from '../../common/MobileHeader.vue'
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

@include mobile {
  .findpw {
    .noti {
      padding: 50px 0 40px 0;
      text-align: center;
      font-size: 1.6rem;
      color: #191919;
      line-height: 1.3;
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
    .input-zone {
      padding: 40px 24px 0;

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
}
</style>
