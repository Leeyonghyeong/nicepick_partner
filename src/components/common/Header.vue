<template>
  <header>
    <div class="header">
      <div class="header-contents">
        <div class="header-menu-box">
          <div class="menu">
            <div class="header-logo">
              <img
                src="../../assets/main_logo.png"
                alt="logo"
                @click="isLogin ? router.push('/management') : router.push('/')"
              />
            </div>
            <div class="header-menu">
              <div
                class="menu-item"
                @click="router.push('/management')"
                :class="{ active: route.fullPath === '/management' }"
              >
                브랜드 관리
              </div>
              <div
                class="menu-item"
                @click="router.push('/qna')"
                :class="{ active: route.fullPath === '/qna' }"
              >
                고객문의
              </div>
              <div
                class="menu-item"
                @click="router.push('/product')"
                :class="{ active: route.fullPath === '/product' }"
              >
                이용서비스
              </div>
              <div
                class="menu-item"
                @click="router.push('/shop')"
                :class="{ active: route.fullPath === '/shop' }"
              >
                광고상품
              </div>
              <div
                class="menu-item"
                @click="router.push('/mypage/user/management')"
                :class="{ active: route.fullPath.includes('/mypage') }"
              >
                마이페이지
              </div>
            </div>
          </div>
          <div class="user-box" v-if="isLogin">
            <div class="user-name" @click="isShowUserInfoBox = true">
              <img
                v-if="brand?.isPremium"
                src="../../assets/header/premium_user.png"
                alt="user"
              />
              <img v-else src="../../assets/header/user.png" alt="user" />
              <div>{{ userName }}님</div>
            </div>

            <div class="user-info-box" v-if="isShowUserInfoBox">
              <div class="top">
                <div>{{ userName }}님</div>
                <div @click="isShowUserInfoBox = false">
                  <i class="fa-solid fa-xmark"></i>
                </div>
              </div>
              <div class="email">
                {{ userEmail }}
              </div>
              <div class="account-menu">
                <div @click="router.push('/mypage/user/management')">
                  내 정보관리
                </div>
                <div>문의내역</div>
                <div @click="router.push('/cart')">장바구니</div>
                <div @click="logout">로그아웃</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import api from '../../config/axios.config'
import { toastAlert } from '../../functions/alert'
import { Brand } from '../../types/brand'

const router = useRouter()
const route = useRoute()
const store = useStore()

const isShowUserInfoBox = ref<boolean>(false)

const brand = ref<Brand>()

const isLogin = computed(() => {
  return store.state.auth.isLogin as boolean
})

const userName = computed(() => {
  return store.state.auth.user.userName as string
})

const userEmail = computed(() => {
  return store.state.auth.user.email as string
})

const brandId = computed(() => {
  return store.state.auth.brandId as string
})

const getBrandInfo = async () => {
  if (isLogin.value) {
    const result = await api.get(`/brand/detail/${brandId.value}`)

    if (result.data.success) {
      brand.value = result.data.brand
    } else {
      toastAlert(result.data.errorMessage)
    }
  }
}

const logout = () => {
  localStorage.removeItem('accessToken')

  store.commit('auth/updateState', {
    isLogin: false,
    brandId: '',
    brandList: [],
    user: {},
  })

  router.push('/')
}

watch(
  () => store.state.auth.brandId,
  () => getBrandInfo()
)

getBrandInfo()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  .header {
    height: 100px;
    .header-contents {
      height: 100px;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;

      .header-menu-box {
        @include pc-container();
        padding-bottom: 16px;
        height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        box-sizing: border-box;

        .menu {
          display: flex;
          align-items: flex-end;
          .header-logo {
            margin-right: 40px;
            img {
              width: 120px;
              height: 48px;
              cursor: pointer;
            }
          }

          .header-menu {
            display: flex;

            .menu-item {
              font-size: 1.6rem;
              color: #191919;
              margin-right: 50px;
              cursor: pointer;

              &:hover {
                color: $primary;
              }

              &.active {
                position: relative;

                &::after {
                  position: absolute;
                  content: '';
                  width: 100%;
                  border-bottom: 3px solid $primary;
                  left: 0;
                  bottom: -16px;
                }
              }
            }
          }
        }

        .user-box {
          position: relative;

          .user-name {
            font-size: 1.4rem;
            color: #888;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            cursor: pointer;

            img {
              margin-bottom: 3px;
            }
          }

          .user-info-box {
            position: absolute;
            width: 160px;
            height: 165px;
            background-color: #f3f8ff;
            top: 70px;
            left: 50%;
            transform: translate(-50%, 0);
            z-index: 999;
            border-radius: 10px;
            padding: 16px 14px;
            border: 2px solid #a1baff;

            &::after {
              content: '';
              position: absolute;
              display: block;
              border-width: 0 10px 10px 10px;
              border-color: #f3f8ff transparent;
              border-style: solid;
              top: -9px;
              left: 50%;
              transform: translate(-50%, 0);
              z-index: 1;
            }
            &::before {
              content: '';
              position: absolute;
              display: block;
              border-width: 0 12px 12px 12px;
              border-color: #a1baff transparent;
              border-style: solid;
              top: -12px;
              left: 50%;
              transform: translate(-50%, 0);
              z-index: 0;
            }

            .top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 16px;
              color: #353535;

              div {
                &:last-child {
                  color: #777;
                  cursor: pointer;
                }
              }
            }

            .email {
              font-size: 12px;
              color: #777;
              margin-top: 8px;
            }

            .account-menu {
              margin-top: 10px;
              font-size: 12px;
              color: #777;
              line-height: 2.5;

              div {
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}

@include tablet {
  .header {
    .header-contents {
      height: 110px;

      .header-top {
        padding-top: 11px;
        padding-right: 24px;
        .header-top-box {
          display: flex;
          justify-content: flex-end;

          .top-box-item {
            font-size: 1.6rem;
            color: #777;
            cursor: pointer;

            &:hover {
              color: #333;
            }

            &:not(:first-child) {
              &::before {
                content: '|';
                margin: 0 15px;
              }
            }
          }
        }
      }

      .header-menu-box {
        position: relative;

        .header-logo {
          position: absolute;
          left: 33px;
          top: -7px;

          img {
            width: 150px;
            cursor: pointer;
          }
        }

        .header-menu {
          display: none;
        }
      }
    }
  }
}

@include mobile {
  header {
    display: none;
  }
}
</style>
