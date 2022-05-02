<template>
  <MobileHeader title="브랜드 전환" :cart="false" :back="true" />
  <Header />
  <main>
    <MypageLeftNav />
    <div class="change-brand">
      <div class="brand-list">
        <div
          class="brand-item"
          v-for="item in brand"
          :key="item.id"
          @click="changeBrand(item.id)"
        >
          <div class="left-initial mobile">
            {{ item.brandName.slice(0, 1) }}
          </div>
          <div class="left-initial desktop">
            <img
              v-if="item.brandLogoImg"
              :src="item.brandLogoImg"
              :alt="item.brandName"
              class="logo"
            />
            <img
              v-else
              :src="loadCategoryImage(item.smallCategoryName)"
              :alt="item.brandName"
              class="category-img"
            />
          </div>
          <div class="right-select">
            <div class="brand-name">{{ item.brandName }}</div>
            <div class="check-img">
              <img
                v-if="store.state.auth.brandId === item.id"
                src="../../assets/mypage/brand_active.png"
                alt="check"
              />
              <img v-else src="../../assets/mypage/brand.png" alt="check" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <Footer />
</template>

<script lang="ts" setup>
import MobileHeader from '../common/MobileHeader.vue'
import Header from '../common/Header.vue'
import MypageLeftNav from './MypageLeftNav.vue'
import Footer from '../common/Footer.vue'
import api from '../../config/axios.config'
import { useStore } from 'vuex'
import { confirmAlert, toastAlert } from '../../functions/alert'
import { Brand } from '../../types/brand'
import { ref } from 'vue'
import { SweetAlertResult } from 'sweetalert2'

const store = useStore()

const brand = ref<Brand[]>([])

const getBrandList = async () => {
  const result = await api.get(`/brand/list/${store.state.auth.user.id}`)

  if (result.data.success) {
    brand.value = result.data.brand
  } else {
    toastAlert(result.data.errorMessage)
  }
}

const changeBrand = async (id: string) => {
  const alert: SweetAlertResult = await confirmAlert(
    '브랜드를 변경 하시겠습니까?'
  )

  if (alert.isConfirmed) {
    store.commit('auth/updateState', {
      brandId: id,
    })

    toastAlert('브랜드가 변경 되었습니다')
  }
}

const loadCategoryImage = (categoryName: string): string => {
  const imgUrl = new URL(
    `../../assets/category/${categoryName
      .replaceAll(' ', '')
      .replaceAll('/', '')}.png`,
    import.meta.url
  )

  return imgUrl.href
}

getBrandList()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  main {
    @include pc-container();
    display: flex;

    .change-brand {
      padding-top: 90px;

      .brand-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 820px;

        .brand-item {
          width: 400px;
          border: 1px solid #cecece;
          margin-bottom: 20px;
          height: 200px;
          box-sizing: border-box;
          cursor: pointer;

          .left-initial {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 125px;

            &.mobile {
              display: none;
            }

            .logo {
              width: 250px;
              height: 100px;
            }

            .category-img {
              width: 100px;
              height: 100px;
            }
          }

          .right-select {
            height: 73px;
            display: flex;
            align-items: center;
            padding: 0 25px 0 44px;
            justify-content: space-between;

            .brand-name {
              font-size: 2.3rem;
              color: #353535;
            }
          }
        }
      }
    }
  }
}

@include mobile {
  .change-brand {
    .brand-list {
      padding: 0 24px;

      .brand-item {
        padding: 16px 0;
        border-bottom: 1px solid #ededed;
        display: flex;

        .left-initial {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: $primary;
          color: #fff;
          font-size: 1.6rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          margin-right: 22px;

          &.desktop {
            display: none;
          }
        }

        .right-select {
          flex: 1 1 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.4rem;
          color: #191919;
          font-weight: bold;

          // .brand-name {
          //   text-overflow: ellipsis;
          //   overflow: hidden;
          //   white-space: nowrap;
          // }

          .check-img {
            width: 20px;

            img {
              width: 20px;
            }
          }
        }
      }
    }
  }

  footer {
    display: none;
  }
}
</style>
