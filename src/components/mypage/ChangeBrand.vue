<template>
  <MobileHeader title="브랜드 전환" :cart="false" :back="true" />
  <main>
    <div class="change-brand">
      <div class="brand-list">
        <div
          class="brand-item"
          v-for="item in brand"
          :key="item.id"
          @click="changeBrand(item.id)"
        >
          <div class="left-initial">
            {{ item.brandName.slice(0, 1) }}
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
</template>

<script lang="ts" setup>
import MobileHeader from '../common/MobileHeader.vue'
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

getBrandList()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

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
}
</style>
