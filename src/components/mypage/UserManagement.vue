<template>
  <MobileHeader title="내 정보관리" :cart="false" :back="true" />
  <Header />
  <main>
    <MypageLeftNav />
    <div class="account">
      <div class="user-info">
        <div class="top">기본 정보</div>
        <div class="info-input-box">
          <div class="email info-item">
            <div class="title">이메일</div>
            <input type="text" :value="store.state.auth.user.email" readonly />
          </div>

          <div class="user-name info-item">
            <div class="title">담당자 명</div>
            <input v-model="userName" type="text" :disabled="!isModUserName" />
            <button
              v-if="!isModUserName"
              class="mod-button"
              @click="isModUserName = true"
            >
              이름 변경
            </button>
            <div v-else class="mod-button-box">
              <button class="cancel-button" @click="cancelModifyUserName">
                취소
              </button>
              <button class="submit-button" @click="modifyUserName">
                변경
              </button>
            </div>
          </div>

          <div class="phoneNumber info-item">
            <div class="title">연락처</div>
            <input
              type="text"
              v-model="phoneNumber"
              :disabled="!isModPhoneNumber"
            />
            <button
              v-if="!isModPhoneNumber"
              @click="isModPhoneNumber = true"
              class="mod-button"
            >
              연락처 변경
            </button>
            <div v-else class="mod-button-box">
              <button class="cancel-button" @click="cancelModifyPhoneNumber">
                취소
              </button>
              <button class="submit-button" @click="modifyPhoneNumber">
                변경
              </button>
            </div>
          </div>

          <div class="password info-item">
            <div class="title">비밀번호</div>
            <div class="password-input" v-if="isModPassword">
              <div class="password">
                <input
                  v-model="password"
                  type="password"
                  placeholder="새 비밀번호 입력(영문+숫자+특수문자 8~16자)"
                  @keyup="checkPasswordImg"
                />
                <div class="validation-password">
                  <img
                    v-if="passwordImgName === 'default'"
                    src="../../assets/signup/default_password.png"
                    alt="default_password"
                  />
                  <img
                    v-else-if="passwordImgName === 'danger'"
                    src="../../assets/signup/danger_password.png"
                    alt="danger_password"
                  />
                  <img
                    v-else
                    src="../../assets/signup/safe_password.png"
                    alt="safe_password"
                  />
                </div>
              </div>
              <div class="re-password">
                <input
                  v-model="rePassword"
                  type="password"
                  placeholder="새 비밀번호 입력(영문+숫자+특수문자 8~16자)"
                />
              </div>
            </div>
            <button
              v-if="!isModPassword"
              class="mod-button"
              @click="isModPassword = true"
            >
              비밀번호 변경
            </button>
            <div v-else class="mod-button-box">
              <button class="cancel-button" @click="cancelModifyPassword">
                취소
              </button>
              <button class="submit-button" @click="modifyPassword">
                변경
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="marketing-box">
        <div class="noti">
          <div>마케팅 정보 수신 동의 (선택)</div>
          <div>수신 동의 시 이벤트 및 각종 행사 등의 정보를 알려드립니다.</div>
        </div>

        <div class="check-box">
          <div class="email-check check">
            <input
              v-model="isEmail"
              type="checkbox"
              id="email"
              @change="modifyMarketing"
            />
            <label for="email">이메일 수신</label>
          </div>
          <div class="sms-check check">
            <input
              v-model="isSMS"
              type="checkbox"
              id="sms"
              @change="modifyMarketing"
            />
            <label for="sms">SMS 수신</label>
          </div>
        </div>
      </div>

      <div class="delete-user" @click="submitDeleteUser">회원탈퇴</div>
    </div>
  </main>
  <Footer />
</template>

<script lang="ts" setup>
import api from '../../config/axios.config'
import { ref } from 'vue'
import { useStore } from 'vuex'
import MobileHeader from '../../components/common/MobileHeader.vue'
import Header from '../common/Header.vue'
import MypageLeftNav from './MypageLeftNav.vue'
import Footer from '../common/Footer.vue'
import { checkAlert, confirmAlert, toastAlert } from '../../functions/alert'
import { SweetAlertResult } from 'sweetalert2'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const isModUserName = ref<boolean>(false)
const isModPhoneNumber = ref<boolean>(false)
const isModPassword = ref<boolean>(false)
const passwordImgName = ref<string>('default')

const userName = ref<string>('')
const phoneNumber = ref<string>('')
const password = ref<string>('')
const rePassword = ref<string>('')

const isEmail = ref<boolean>(false)
const isSMS = ref<boolean>(false)

const getUserInfo = async () => {
  try {
    const token = localStorage.getItem('accessToken')

    const headers = {
      Authorization: `Bearer ${token}`,
    }

    const result = await api.get('/auth', { headers })

    store.commit('auth/updateState', {
      isLogin: true,
      user: {
        id: result.data.id,
        userName: result.data.userName,
        email: result.data.email,
        phoneNumber: result.data.phoneNumber,
      },
    })

    userName.value = store.state.auth.user.userName
    phoneNumber.value = store.state.auth.user.phoneNumber
    isEmail.value = result.data.isEmail
    isSMS.value = result.data.isSMS
  } catch (err) {
    localStorage.removeItem('accessToken')

    store.commit('auth/updateState', {
      isLogin: false,
      user: {},
      brandId: '',
    })

    const alert: SweetAlertResult = await checkAlert(
      '비정상적인 접근으로 인해 다시 로그인 해주시기 바랍니다'
    )

    if (alert.isConfirmed) {
      router.push('/')
    }
  }
}

const modifyUserName = async () => {
  if (!userName.value) {
    toastAlert('이름을 입력해 주세요')
    return
  }

  const result = await api.patch('/auth/userName', {
    id: store.state.auth.user.id,
    userName: userName.value,
  })

  if (result.data.success) {
    const alert: SweetAlertResult = await checkAlert('이름이 변경 되었습니다')

    if (alert.isConfirmed) {
      isModUserName.value = false

      store.commit('auth/updateState', {
        user: {
          id: store.state.auth.user.id,
          userName: userName.value,
          email: store.state.auth.user.email,
          phoneNumber: store.state.auth.user.phoneNumber,
        },
      })
    }
  } else {
    toastAlert('이름 변경에 실패했습니다')
    isModUserName.value = false
    userName.value = store.state.auth.user.userName
  }
}

const cancelModifyUserName = () => {
  userName.value = store.state.auth.user.userName
  isModUserName.value = false
}

const modifyPhoneNumber = async () => {
  if (!phoneNumber.value) {
    toastAlert('연락처를 입력해 주세요')
    return
  }

  const regPhone = /^01([0|1|6|7|8|9]{1})([0-9]{3,4})([0-9]{4})$/
  phoneNumber.value = phoneNumber.value.replaceAll('-', '')

  if (!regPhone.test(phoneNumber.value)) {
    toastAlert('연락처가 올바르지 않습니다')
    return
  }

  const result = await api.patch('/auth/phoneNumber', {
    id: store.state.auth.user.id,
    phoneNumber: phoneNumber.value,
  })

  if (result.data.success) {
    const alert: SweetAlertResult = await checkAlert('연락처가 변경 되었습니다')

    if (alert.isConfirmed) {
      isModPhoneNumber.value = false

      store.commit('auth/updateState', {
        user: {
          phoneNumber: phoneNumber.value,
          id: store.state.auth.user.id,
          userName: store.state.auth.user.userName,
          email: store.state.auth.user.email,
        },
      })
    }
  } else {
    toastAlert('연락처 변경에 실패 했습니다')
    isModPhoneNumber.value = false
    phoneNumber.value = store.state.auth.user.phoneNumber
  }
}

const cancelModifyPhoneNumber = () => {
  phoneNumber.value = store.state.auth.user.phoneNumber
  isModPhoneNumber.value = false
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

  const result = await api.patch('/auth/password', {
    id: store.state.auth.user.id,
    password: password.value,
    rePassword: rePassword.value,
  })

  if (result.data.success) {
    const alert: SweetAlertResult = await checkAlert(
      '비밀번호가 변경 되었습니다'
    )

    if (alert.isConfirmed) {
      password.value = ''
      rePassword.value = ''
      isModPassword.value = false
    }
  } else {
    toastAlert('비밀번호 변경에 실패 했습니다')
    password.value = ''
    rePassword.value = ''
    isModPassword.value = false
  }
}

const cancelModifyPassword = () => {
  password.value = ''
  rePassword.value = ''
  isModPassword.value = false
}

const modifyMarketing = async () => {
  const result = await api.patch('/auth/marketing', {
    id: store.state.auth.user.id,
    isEmail: isEmail.value,
    isSMS: isSMS.value,
  })

  if (result.data.success) {
    checkAlert('마케팅 정보 수신 동의가 변경 되었습니다')
  } else {
    toastAlert('마케팅 정보 수신 동의 변경에 실패했습니다')
  }
}

const submitDeleteUser = async () => {
  const alert: SweetAlertResult = await confirmAlert(
    '개인정보 및 결제내역이 모두 삭제됩니다. 정말 탈퇴 하시겠습니까?'
  )

  if (alert.isConfirmed) {
    const result = await api.delete(`/auth/delete/${store.state.auth.user.id}`)

    if (result.data.success) {
      const deleteAlert: SweetAlertResult = await checkAlert('탈퇴 되었습니다')

      if (deleteAlert.isConfirmed) {
        localStorage.removeItem('accessToken')

        store.commit('auth/updateState', {
          user: {},
          isLogin: false,
          brandId: '',
        })

        router.push('/')
      }
    } else {
      toastAlert('회원 탈퇴에 실패했습니다. 고객센터로 문의 주시기 바랍니다')
    }
  }
}

getUserInfo()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  main {
    display: flex;
    @include pc-container();

    .account {
      .user-info {
        padding-top: 30px;
        padding-bottom: 40px;
        border-bottom: 1px solid #eee;
        .top {
          font-size: 1.8rem;
          color: #353535;
          padding-bottom: 10px;
          padding-left: 15px;
          border-bottom: 1px solid #eee;
          margin-bottom: 40px;
        }

        .info-input-box {
          .info-item {
            padding-left: 20px;
            display: flex;
            align-items: center;
            font-size: 1.4rem;
            color: #353535;
            margin-bottom: 10px;

            &:last-child {
              margin: 0;
            }

            .title {
              width: 133px;
            }

            input {
              width: 400px;
              height: 40px;
              border: 1px solid #cfcfcf;
              font-size: 1.4rem;
              margin-right: 10px;
              padding: 0 15px;

              &::placeholder {
                color: #888;
              }
            }

            .mod-button {
              width: 150px;
              height: 40px;
              background-color: #777;
              color: #fff;
              font-size: 1.4rem;
              border-radius: 10px;
              cursor: pointer;
            }

            .mod-button-box {
              button {
                width: 70px;
                height: 40px;
                border-radius: 10px;
                font-size: 1.4rem;
                cursor: pointer;
              }
              .cancel-button {
                background-color: #fff;
                border: 1px solid #cfcfcf;
                color: #777;
                margin-right: 7px;
              }

              .submit-button {
                background-color: $primary;
                color: #fff;
              }
            }

            &.password {
              .password-input {
                position: relative;

                .validation-password {
                  position: absolute;
                  top: 13px;
                  right: 22px;

                  img {
                    height: 16px;
                  }
                }

                .re-password {
                  margin-top: 7px;
                }
              }
            }
          }
        }
      }

      .marketing-box {
        margin-top: 40px;

        .noti {
          font-size: 1.4rem;
          color: #353535;
          font-weight: bold;
          line-height: 1.4;

          div {
            &:last-child {
              font-size: 1.2rem;
              color: #acacac;
              font-weight: normal;
            }
          }
        }

        .check-box {
          display: flex;
          margin-top: 20px;

          input[type='checkbox'] {
            position: absolute;
            width: 0px;
            height: 0px;
          }

          input[type='checkbox'] + label::before {
            content: '\2713';
            color: #fff;
            font-weight: bold;
            width: 20px;
            height: 20px;
            background: #dcdcdc;
            text-align: center;
            line-height: 2rem;
            border-radius: 50%;
            font-size: 1.4rem;
            display: inline-block;
            margin-right: 12px;
          }

          input[type='checkbox']:checked + label::before {
            content: '\2713';
            color: #fff;
            font-weight: bold;
            background: $primary;
          }

          .check {
            display: flex;
            align-items: center;

            &:last-child {
              margin-left: 82px;
            }

            label {
              font-size: 1.6rem;
              color: #353535;
            }
          }
        }
      }

      .delete-user {
        width: 60px;
        margin-top: 54px;
        font-size: 1.4rem;
        color: #888;
        margin-bottom: 180px;
        cursor: pointer;
      }
    }
  }
}

@include mobile {
  main {
    min-height: 0;
  }
  .account {
    .user-info {
      padding: 24px 24px 0;

      .top {
        font-size: 1.8rem;
        color: #191919;
        font-weight: bold;
      }

      .info-input-box {
        margin-top: 12px;

        .info-item {
          font-size: 1.2rem;
          color: #191919;
          margin-top: 16px;

          &:first-child {
            margin-top: 0;
          }

          &:last-child {
            border-bottom: 1px solid #ededed;
            padding-bottom: 24px;
          }

          input {
            padding: 0 12px;
            width: 100%;
            height: 50px;
            border: 1px solid #ededed;
            border-radius: 5px;
            font-size: 1.6rem;
            margin-top: 8px;

            &:read-only {
              color: #999;
            }
          }

          .mod-button {
            width: 100%;
            height: 50px;
            background-color: #777;
            border-radius: 5px;
            font-size: 1.4rem;
            color: #fff;
            margin-top: 8px;
          }

          .mod-button-box {
            margin-top: 8px;
            display: flex;
            justify-content: space-between;

            button {
              flex-grow: 0.48;
              height: 50px;
              border-radius: 5px;
              font-size: 1.4rem;
              color: #191919;

              &.cancel-button {
                border: 1px solid #dbdbdb;
                background-color: #fff;
              }

              &.submit-button {
                background-color: $primary;
                color: #fff;
              }
            }
          }

          .password-input {
            .password {
              position: relative;
              display: flex;
              align-items: center;

              .validation-password {
                position: absolute;
                right: 12px;

                img {
                  margin-top: 10px;
                  height: 16px;
                }
              }
            }
          }
        }
      }
    }

    .marketing-box {
      padding: 40px 24px 20px;
      .noti {
        font-size: 1.8rem;
        color: #191919;
        font-weight: bold;
        line-height: 1.5;

        div {
          &:last-child {
            font-size: 1.2rem;
            color: #767676;
            font-weight: normal;
          }
        }
      }

      .check-box {
        display: flex;
        margin-top: 20px;

        .check {
          display: flex;
          align-items: center;
          font-size: 1.4rem;
          color: #191919;
          margin-right: 20px;

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
            background-color: #fff;
            text-align: center;
            line-height: 2rem;
            border-radius: 50%;
            font-size: 1.6rem;
            display: inline-block;
            margin-right: 8px;
            border: 1px solid #dcdcdc;
          }

          input[type='checkbox']:checked + label::before {
            content: '\2713';
            color: #fff;
            font-weight: bold;
            background: $primary;
          }
        }
      }
    }

    .delete-user {
      font-size: 1.2rem;
      color: #999;
      padding: 0 24px 40px;
    }
  }
}
</style>
