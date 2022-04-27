<template>
  <MobileHeader title="대표 키워드 추가" :cart="false" :back="true" />
  <main>
    <div class="brand-keyword">
      <div class="keyword-count">
        <div>
          해시태그 키워드 추가 <span>{{ tagList.length }}</span> / 6
        </div>
        <div>(키워드 검색시 브랜드 노출 효과 상승)</div>
      </div>

      <div class="keyword-input">
        <input
          v-model="tag"
          type="text"
          placeholder="키워드를 입력해주세요. (예 : 무인)"
          @keypress.enter="addTag"
        />
        <div class="submit" @click="addTag">등록</div>
      </div>

      <div class="keyword-list">
        <div class="keyword-item" v-for="item in tagList" :key="item.id">
          <div>#{{ item.tag }}</div>
          <img
            src="../../assets/mypage/tag_delete.png"
            alt="delete"
            @click="deleteTag(item.id)"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import MobileHeader from '../common/MobileHeader.vue'
import api from '../../config/axios.config'
import { ref } from 'vue'
import { confirmAlert, toastAlert } from '../../functions/alert'
import { SweetAlertResult } from 'sweetalert2'

interface BrandTag {
  id: string
  tag: string
  brandId: string
}

const store = useStore()

const tag = ref<string>('')
const tagList = ref<BrandTag[]>([])

const getTagList = async () => {
  const result = await api.get(`/brand/tag/${store.state.auth.brandId}`)

  if (result.data.success) {
    tagList.value = result.data.brandTag
  } else {
    toastAlert(result.data.errorMessage)
  }
}

const addTag = async () => {
  if (!tag.value) {
    toastAlert('키워드를 입력하세요')
    return
  }

  const result = await api.post('/brand/tag', {
    tag: tag.value,
    brandId: store.state.auth.brandId,
  })

  if (result.data.success) {
    tag.value = ''
    getTagList()
  } else {
    tag.value = ''
    toastAlert(result.data.errorMessage)
  }
}

const deleteTag = async (id: string) => {
  const alert: SweetAlertResult = await confirmAlert(
    '키워드를 삭제하시겠습니까?'
  )

  if (alert.isConfirmed) {
    const result = await api.delete(`/brand/tag/${id}`)

    if (result.data.success) {
      toastAlert('키워드가 삭제 되었습니다')
      getTagList()
    } else {
      toastAlert(result.data.errorMessage)
    }
  }
}

getTagList()
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include mobile {
  .brand-keyword {
    .keyword-count {
      padding: 24px;
      font-size: 1.8rem;
      color: #191919;
      font-weight: bold;
      line-height: 1.5;

      div {
        span {
          color: $primary;
        }

        &:last-child {
          font-size: 1.4rem;
          color: #999;
          font-weight: normal;
        }
      }
    }

    .keyword-input {
      padding: 0 24px;
      position: relative;
      display: flex;
      align-items: center;

      input {
        width: 100%;
        height: 50px;
        font-size: 1.6rem;
        color: #191919;
        border: 1px solid #ededed;
        border-radius: 5px;
        padding: 0 12px;

        &::placeholder {
          color: #999;
        }
      }

      .submit {
        position: absolute;
        right: 36px;
        font-size: 1.4rem;
        color: #999;
      }
    }

    .keyword-list {
      margin-top: 40px;
      padding: 0 24px;
      display: flex;
      flex-wrap: wrap;

      .keyword-item {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        border: 1px solid #ededed;
        border-radius: 25px;
        font-size: 1.4rem;
        color: #191919;
        font-weight: bold;
        margin-right: 8px;
        margin-bottom: 12px;

        img {
          width: 28px;
        }
      }
    }
  }
}
</style>
