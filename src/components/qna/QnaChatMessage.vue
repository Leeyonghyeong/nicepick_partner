<template>
  <div class="qna-message">
    <MobileHeader :title="currentUserName" :back="true" :cart="false" />
    <div class="qna-message-body">
      <div class="message-item-list" ref="chatListDiv">
        <div
          class="message-item"
          v-for="(item, i) in chatMessageList"
          :key="item.id"
        >
          <div
            id="chatDate"
            v-if="
              compareDate(
                item.createAt,
                chatMessageList[i === 0 ? i : i - 1].createAt,
                i
              )
            "
          >
            <div>{{ chatDateString(item.createAt) }}</div>
          </div>
          <div
            class="chatText"
            :class="{
              me: item.senderId === brandId,
              you: item.senderId !== brandId,
            }"
          >
            <div id="date">{{ convertDate(item.createAt) }}</div>
            <div id="text" v-if="item.type === 'text'">
              {{ item.message }}
            </div>
            <div id="text" v-else-if="item.type === 'image'">
              <a :href="item.message" target="_blank">
                <img :src="item.message" :alt="item.fileOriginName" />
              </a>
            </div>
            <div
              id="text"
              class="file-download"
              v-else
              @click="fileDownLoad(item.fileOriginName, item.message)"
            >
              {{ item.fileOriginName }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bottom-message-input">
    <div class="input-box">
      <input type="file" name="" id="fileUpload" @change="sendFile" multiple />
      <label for="fileUpload">+</label>
      <input
        v-model="message"
        type="text"
        placeholder="메세지를 입력하세요"
        @keypress.enter="sendMessage"
      />
    </div>
    <div class="send-button">
      <button @click="sendMessage">
        <img src="../../assets/qna/send.png" alt="send" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MobileHeader from '../common/MobileHeader.vue'
import { ChatMessage } from '../../types/chat'
import { convertDate, chatDateString, compareDate } from '../../functions/chat'
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'

const props = defineProps<{
  brandId: string
  currentUserName: string
  chatMessageList: ChatMessage[]
  roomId: string
}>()

const emit = defineEmits<{
  (e: 'sendMessage', msg: string): void
  (e: 'sendFile', event: Event): void
}>()

const chatListDiv = ref<HTMLDivElement>()

const message = ref<string>('')

const sendMessage = () => {
  emit('sendMessage', message.value)
  message.value = ''
  setTimeout(() => {
    chatBottom()
  }, 500)
}

const sendFile = (e: Event) => {
  emit('sendFile', e)
  setTimeout(() => {
    chatBottom()
  }, 500)
}

const fileDownLoad = (originName: string, filePath: string) => {
  axios({
    url: filePath,
    method: 'GET',
    responseType: 'blob',
  }).then((res) => {
    const blob = new Blob([res.data])
    const fileObjectUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = fileObjectUrl
    link.style.display = 'none'

    link.download = originName

    document.body.appendChild(link)
    link.click()
    link.remove()

    window.URL.revokeObjectURL(fileObjectUrl)
  })
}

const chatBottom = () => {
  if (chatListDiv.value) {
    const height = chatListDiv.value.scrollHeight

    if (props.chatMessageList.length > 10) {
      window.scrollTo({ top: height })
    }
  }
}

watch(
  () => props.chatMessageList,
  () => {
    setTimeout(() => {
      chatBottom()
    }, 500)
  }
)

onMounted(() => {
  setTimeout(() => {
    chatBottom()
  }, 500)
})
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include mobile {
  .qna-message {
    position: relative;
    background-color: #fff;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    .qna-message-body {
      flex: 1;
      display: flex;
      height: 100%;
      flex-direction: column;
      position: relative;

      .message-item-list {
        flex: 1;
        overflow-y: auto;
        padding: 20px 24px;
        background-color: #f3f8ff;

        .message-item {
          #chatDate {
            display: flex;
            justify-content: center;
            font-size: 1.2rem;
            color: #999;

            div {
              background-color: #ededed;
              padding: 4px 8px;
              border-radius: 15px;
            }
          }

          .chatText {
            margin-top: 15px;
            padding: 10px;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            word-break: break-all;

            #date {
              font-size: 1.2rem;
              color: #767676;
            }

            #text {
              font-size: 1.4rem;
              color: #191919;
              padding: 8px;
              max-width: 60vw;
              box-sizing: content-box;

              &.file-download {
                color: #0000ee;
                text-decoration: underline;
                cursor: pointer;
              }

              img {
                max-width: 60vw;
              }
            }

            &.me {
              #text {
                margin-left: 6px;
                background-color: #ffdc51;
                border-radius: 10px 0 10px 10px;
              }
            }

            &.you {
              flex-direction: row-reverse;
              #text {
                margin-right: 6px;
                background-color: #fff;
                border-radius: 0 10px 10px 10px;
              }
            }
          }
        }
      }
    }
  }

  .bottom-message-input {
    position: sticky;
    z-index: 1;
    bottom: 0;
    height: 50px;
    width: 100%;
    display: flex;
    box-shadow: 0 -10px 10px 0 rgba(0, 0, 0, 0.08);

    .input-box {
      width: 0px;
      flex: 1 1 0;
      display: flex;

      input[type='file'] {
        width: 0;
        height: 0;
      }

      label {
        background-color: #f1f1f5;
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2.5rem;
        font-weight: normal;
        color: #000;
      }

      input[type='text'] {
        flex: 1;
        font-size: 1.6rem;
        border: none;
        padding: 0 12px;
        margin: 0;
        border-radius: 0;
        box-sizing: border-box;
      }
    }

    .send-button {
      width: 50px;

      button {
        background-color: #ffdc51;
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;

        img {
          width: 16px;
        }
      }
    }
  }
}
</style>
