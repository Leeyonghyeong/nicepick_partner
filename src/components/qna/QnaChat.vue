<template>
  <Header />
  <main id="desktop">
    <div class="qna-chat">
      <div class="chat-top">
        <div class="select-brand">
          <div class="current-brand">
            <div class="brand-name">{{ currentBrand?.brandName }}</div>
            <div class="open-close" @click="isBrandSelect = !isBrandSelect">
              <img
                v-if="!isBrandSelect"
                src="../../assets/qna/brand_list_open.png"
                alt="open"
              />
              <img
                v-else
                src="../../assets/qna/brand_list_close.png"
                alt="open"
              />
            </div>
          </div>

          <div class="select-brand-list" v-if="isBrandSelect">
            <div
              class="brand-list-item"
              v-for="item in brand"
              :key="item.id"
              :class="{ current: item.id === brandId }"
              @click="changeBrand(item)"
            >
              {{ item.brandName }}
            </div>
          </div>
        </div>
      </div>

      <div class="chat-body">
        <div class="left-room-list">
          <div class="room-list-top">
            <div class="list-type">
              <div class="top-menu" @click="getFindRoomList(0)">
                <img src="../../assets/qna/all.png" alt="전체" />
                <div class="top-text" :class="{ active: listType === 0 }">
                  전체
                </div>
              </div>
              <div class="line"></div>
              <div class="top-menu" @click="getFindRoomList(1)">
                <div class="read-count">{{ noReadCount }}</div>
                <div class="top-text" :class="{ active: listType === 1 }">
                  안읽음
                </div>
              </div>
            </div>

            <div class="search-brand">
              <input
                v-model="userName"
                type="text"
                placeholder="고객명 검색"
                ref="searchInput"
                @input="getFindRoomList(listType)"
              />
              <img
                src="../../assets/qna/search.png"
                alt="search"
                id="searchIcon"
              />
            </div>
          </div>

          <div class="room-list-body">
            <div class="room-list">
              <div
                v-if="
                  (listType === 0 && chatRoomList.length === 0) ||
                  (listType === 1 && chatNoReadRoomList.length === 0) ||
                  (userName !== '' && findRoomList.length === 0)
                "
                class="empty-room"
              >
                {{
                  userName !== '' && findRoomList.length === 0
                    ? '검색 결과가 존재하지 않습니다'
                    : '새로운 문의 내역이 없습니다'
                }}
              </div>

              <div v-else class="room-items">
                <div
                  class="room-item"
                  v-for="item in listType === 0 && userName === ''
                    ? chatRoomList
                    : listType === 0 && userName !== ''
                    ? findRoomList
                    : listType === 1 && userName === ''
                    ? chatNoReadRoomList
                    : findRoomList"
                  :key="item.id"
                  :class="{ active: item.id === roomId }"
                  @click="getChatMessageList(item.id, item.user.id)"
                >
                  <div class="room-info">
                    <div class="left-logo-image">
                      {{ item.user.userName.slice(0, 1) }}
                    </div>
                    <div class="right-brand-chat">
                      <div class="brand-name">
                        <div id="brandName">{{ item.user.userName }}</div>
                        <div id="time">{{ calcDate(item.updateAt) }}</div>
                      </div>
                      <div class="last-chat">
                        <div id="chatText">
                          {{ item.lastChatMessage }}
                        </div>
                        <div id="newCount" v-if="item.newMessageCount > 0">
                          {{ item.newMessageCount }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-chat-list">
          <div class="top-chat-list">
            <div class="chat-list-body">
              <div class="chat-item-list">
                <div
                  class="chat-item"
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
                    {{ chatDateString(item.createAt) }}
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
          <div class="bottom-chat-input">
            <div class="input-box">
              <input
                v-model="message"
                type="text"
                placeholder="메세지를 입력하세요"
                @keypress.enter="sendMessage"
              />
              <div class="input-file">
                <input
                  type="file"
                  id="fileUpload"
                  @change="sendFile"
                  multiple
                />
                <label for="fileUpload">
                  <img src="../../assets/qna/add.png" alt="add" />
                </label>
              </div>
            </div>
            <button @click="sendMessage">
              <img src="../../assets/qna/send.png" alt="전송" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
  <Footer />

  <main id="mobile">
    <div class="main" v-if="!isMessageComponent">
      <MobileHeader title="고객 문의 관리" :back="true" :cart="false" />
      <div class="qna-chat">
        <div class="qna-chat-body">
          <div class="qna-chat-body-top">
            <div class="list-type">
              <div
                class="top-menu"
                @click="getFindRoomList(0)"
                :class="{ active: listType === 0 }"
              >
                <div>전체</div>
              </div>
              <div class="line"></div>
              <div
                class="top-menu"
                @click="getFindRoomList(1)"
                :class="{ active: listType === 1 }"
              >
                <div>{{ noReadCount }}</div>
                <div>안읽음</div>
              </div>
            </div>

            <div class="search-brand">
              <div class="search-input">
                <input
                  v-model="userName"
                  type="text"
                  placeholder="고객명을 검색해 주세요"
                  ref="searchInput"
                  @input="getFindRoomList(listType)"
                />
                <img
                  src="../../assets/qna/search.png"
                  alt="search"
                  id="search"
                />
                <img
                  src="../../assets/qna/cancel.png"
                  alt="cancel"
                  id="cancel"
                  @click="userName = ''"
                />
              </div>
            </div>
          </div>

          <div class="qna-chat-body-room-list">
            <div class="room-list">
              <div
                class="empty-room"
                v-if="
                  (listType === 0 && chatRoomList.length === 0) ||
                  (listType === 1 && chatNoReadRoomList.length === 0) ||
                  (userName !== '' && findRoomList.length === 0)
                "
              >
                {{
                  userName !== '' && findRoomList.length === 0
                    ? '검색 결과가 존재하지 않습니다'
                    : '새로운 문의 내역이 없습니다'
                }}
              </div>

              <div class="room-items" v-else>
                <div
                  class="room-item"
                  v-for="item in listType === 0 && userName === ''
                    ? chatRoomList
                    : listType === 0 && userName !== ''
                    ? findRoomList
                    : listType === 1 && userName === ''
                    ? chatNoReadRoomList
                    : findRoomList"
                  :key="item.id"
                  @click="
                    changeChatRoom(item.id, item.user.id, item.user.userName)
                  "
                  :class="{ active: item.id === roomId }"
                >
                  <div class="left-logo-image">
                    {{ item.user.userName.slice(0, 1) }}
                  </div>
                  <div class="right-brand-chat">
                    <div class="brand-name">
                      <div id="brandName">{{ item.user.userName }}</div>
                      <div id="time">{{ calcDate(item.updateAt) }}</div>
                    </div>
                    <div class="last-chat">
                      <div id="chatText">
                        {{ item.lastChatMessage }}
                      </div>
                      <div id="newCount" v-if="item.newMessageCount > 0">
                        {{ item.newMessageCount }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <QnaChatMessage
      v-else
      :brandId="brandId"
      :currentUserName="currentUserName"
      :chatMessageList="chatMessageList"
      :roomId="roomId"
      @sendMessage="mobileSendMessage"
      @sendFile="sendFile"
    />
  </main>
  <BottomNav v-if="!isMessageComponent" />
</template>

<script lang="ts" setup>
import Header from '../common/Header.vue'
import MobileHeader from '../common/MobileHeader.vue'
import Footer from '../common/Footer.vue'
import BottomNav from '../common/BottomNav.vue'
import { useStore } from 'vuex'
import api from '../../config/axios.config'
import { Brand } from '../../types/brand'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { checkAlert, toastAlert } from '../../functions/alert'
import { ChatRoom, ChatMessage } from '../../types/chat'
import { Page } from '../../types/page'
import { io } from 'socket.io-client'
import axios from 'axios'
import {
  calcDate,
  chatDateString,
  compareDate,
  convertDate,
} from '../../functions/chat'
import QnaChatMessage from './QnaChatMessage.vue'

const store = useStore()

const brand = ref<Brand[]>([])
const currentBrand = ref<Brand>()

const isBrandSelect = ref<boolean>(false)
const listType = ref<number>(0)
const noReadCount = ref<number>(0)

const chatRoomList = ref<ChatRoom[]>([])
const chatNoReadRoomList = ref<ChatRoom[]>([])
const findRoomList = ref<ChatRoom[]>([])
const roomId = ref<string>('')
const receiverId = ref<string>('')

const chatMessageList = ref<ChatMessage[]>([])
const page = ref<number>(1)
const pageView = ref<Page>()

const userName = ref<string>('')
const currentUserName = ref<string>('')
const searchInput = ref<HTMLInputElement>()
const message = ref<string>('')

const isMessageComponent = ref<boolean>(false)

const brandId = computed(() => {
  return store.state.auth.brandId as string
})

const getBrandList = async () => {
  const result = await api.get(`/brand/list/${store.state.auth.user.id}`)

  if (result.data.success) {
    brand.value = result.data.brand
    const _currentBrand: Brand | undefined = brand.value.find(
      (e) => e.id === brandId.value
    )
    if (_currentBrand) {
      currentBrand.value = _currentBrand
    }
  } else {
    toastAlert(result.data.errorMessage)
  }
}

const changeBrand = (selectBrand: Brand) => {
  store.commit('auth/updateState', {
    brandId: selectBrand.id,
  })

  currentBrand.value = selectBrand
  isBrandSelect.value = false
}

const getRoomList = async () => {
  const result = await api.get(`/chat/room/list/${brandId.value}`)

  if (result.data.success) {
    chatRoomList.value = result.data.chatRoom

    for (const room of chatRoomList.value) {
      const newMessageCount = await api.get(
        `/chat/new/message/${room.id}/COMPANY`
      )

      if (newMessageCount.data.success) {
        room.newMessageCount = newMessageCount.data.count
      } else {
        room.newMessageCount = 0
      }
    }

    chatNoReadRoomList.value = chatRoomList.value.filter(
      (e) => e.newMessageCount > 0
    )
  } else {
    checkAlert(result.data.errorMessage)
  }
}

const getFindRoomList = async (type: number) => {
  if (searchInput.value) userName.value = searchInput.value.value

  listType.value = type
  if (listType.value === 0) {
    findRoomList.value = chatRoomList.value.filter((e) =>
      e.user.userName.toLowerCase().includes(userName.value.toLowerCase())
    )
  } else {
    findRoomList.value = chatNoReadRoomList.value.filter((e) =>
      e.user.userName.toLowerCase().includes(userName.value.toLowerCase())
    )
  }
}

const getChatMessageList = async (id: string, userId: string) => {
  roomId.value = id
  receiverId.value = userId

  if (roomId.value === '') {
    return
  }

  const getMessageList = await api.get(
    `/chat/message/${roomId.value}/${page.value}/COMPANY`
  )

  if (getMessageList.data.success) {
    chatMessageList.value = getMessageList.data.chatMessage.reverse()
    pageView.value = getMessageList.data.page

    getNoReadCount()
    getRoomList()

    setTimeout(() => {
      chatBottom()
    }, 100)
  } else {
    checkAlert(getMessageList.data.errorMessage)
  }
}

const changeChatRoom = (id: string, userId: string, userName: string) => {
  getChatMessageList(id, userId)
  currentUserName.value = userName
  window.history.pushState({ page: 'chat' }, '', '#chat')
  isMessageComponent.value = true
}

const closeMessageComponent = () => {
  roomId.value = ''
  currentUserName.value = ''
  isMessageComponent.value = false
}

const sendMessage = async () => {
  if (message.value === '') {
    return
  }

  if (roomId.value === '') {
    checkAlert('대화방을 선택해 주세요')
  } else {
    const addChatMessage = await api.post('/chat/message', {
      message: message.value,
      senderId: brandId.value,
      type: 'text',
      chatRoomId: roomId.value,
      isBrandRead: true,
    })

    if (addChatMessage.data.success) {
      getChatMessageList(roomId.value, receiverId.value)
      getRoomList()
      setTimeout(() => {
        chatBottom()
      }, 100)

      socket.emit('message', {
        receiverId: receiverId.value,
      })
    } else {
      checkAlert(addChatMessage.data.errorMessage)
    }
  }

  message.value = ''
}

const mobileSendMessage = async (msg: string) => {
  if (msg === '') {
    return
  }

  if (roomId.value === '') {
    checkAlert('대화방을 선택해 주세요')
  } else {
    const addChatMessage = await api.post('/chat/message', {
      message: msg,
      senderId: brandId.value,
      type: 'text',
      chatRoomId: roomId.value,
      isBrandRead: true,
    })

    if (addChatMessage.data.success) {
      getChatMessageList(roomId.value, receiverId.value)
      getRoomList()
      setTimeout(() => {
        chatBottom()
      }, 100)

      socket.emit('message', {
        receiverId: receiverId.value,
      })
    } else {
      checkAlert(addChatMessage.data.errorMessage)
    }
  }
}

const sendFile = async (e: Event) => {
  const input: HTMLInputElement = e.target as HTMLInputElement
  const files = input.files

  if (roomId.value === '') {
    checkAlert('대화방을 선택해 주세요')
    return
  }

  if (files && files.length > 0) {
    const formData = new FormData()

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    formData.append('senderId', brandId.value)
    formData.append('chatRoomId', roomId.value)
    formData.append('isBrandRead', 'true')

    const addChatFile = await api.post(`/chat/file`, formData)

    if (addChatFile.data.success) {
      getChatMessageList(roomId.value, receiverId.value)
      getRoomList()
      setTimeout(() => {
        chatBottom()
      }, 100)

      socket.emit('message', {
        receiverId: receiverId.value,
      })
    } else {
      checkAlert(addChatFile.data.errorMessage)
    }
  }
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

const getNoReadCount = async () => {
  const result = await api.get(`/chat/read/count/${brandId.value}/COMPANY`)

  if (result.data.success) {
    noReadCount.value = result.data.count.count
  } else {
    checkAlert(result.data.errorMessage)
  }
}

const chatBottom = () => {
  const height = document.querySelector('.chat-item-list')?.scrollHeight
  document.querySelector('.chat-item-list')?.scrollTo({ top: height })
}

const chatInit = () => {
  getRoomList()
  getNoReadCount()
}

watch(
  () => brandId.value,
  () => {
    chatInit()
    chatMessageList.value = []

    socket.emit('add_socket', {
      userType: 'COMPANY',
      typeId: brandId.value,
    })
  }
)

onMounted(() => {
  chatBottom()
})

getBrandList()
chatInit()

// socket
const socket = io('https://api.nicepick.co.kr')

socket.on('connect', () => {
  socket.emit('add_socket', {
    userType: 'COMPANY',
    typeId: brandId.value,
  })
})

socket.on('received', () => {
  chatInit()
  getChatMessageList(roomId.value, receiverId.value)
})

window.addEventListener('popstate', closeMessageComponent)

onUnmounted(() => {
  socket.disconnect()
  window.removeEventListener('popstate', closeMessageComponent)
})
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
  #mobile {
    display: none;
  }
  .qna-chat {
    @include pc-container();

    .chat-top {
      .select-brand {
        background-color: $primary;
        height: 50px;
        position: relative;

        .current-brand {
          display: flex;
          padding: 0 25px;
          justify-content: space-between;
          align-items: center;
          height: 100%;

          .brand-name {
            font-size: 20px;
            color: #fff;
            font-weight: 500;
          }

          .open-close {
            cursor: pointer;
          }
        }

        .select-brand-list {
          position: absolute;
          background-color: #fff;
          width: 100%;
          z-index: 1;

          .brand-list-item {
            height: 50px;
            font-size: 2rem;
            color: #646464;
            padding-left: 25px;
            display: flex;
            align-items: center;
            cursor: pointer;

            &.current {
              color: $primary;
            }

            &:hover {
              background-color: #f9f9f9;
            }
          }
        }
      }
    }

    .chat-body {
      display: flex;
      height: 700px;
      .left-room-list {
        background-color: #f9f9f9;
        width: 470px;
        height: 100%;
        display: flex;
        flex-direction: column;

        .room-list-top {
          padding: 20px 10px 0;

          .list-type {
            display: flex;

            .top-menu {
              flex: 1 1 0;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              flex-direction: column;
              padding-bottom: 15px;
              height: 80px;
              cursor: pointer;
              box-sizing: border-box;

              .top-text {
                margin-top: 8px;
                font-size: 1.7rem;
                color: #888;

                &.active {
                  font-weight: bold;
                }
              }

              .read-count {
                color: $primary;
                font-weight: bold;
                font-size: 1.6rem;
              }
            }

            .line {
              border-left: 1px solid #e8e8e8;
              height: 80px;
            }
          }

          .search-brand {
            margin-top: 20px;
            width: 100%;
            position: relative;
            display: flex;
            align-items: center;

            input {
              border: none;
              background-color: #fff;
              width: 100%;
              height: 56px;
              padding-left: 87px;
              font-size: 1.6rem;
              color: #191919;

              &::placeholder {
                color: #707070;
              }
            }

            #searchIcon {
              position: absolute;
              left: 39px;
            }
          }
        }

        .room-list-body {
          flex: 1 1 0;
          padding: 12px 10px 0;
          width: 100%;
          overflow: hidden;
          box-sizing: border-box;

          .room-list {
            background-color: #fff;
            width: 100%;
            height: 100%;
            overflow-y: scroll;
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */

            &::-webkit-scrollbar {
              display: none;
            }

            .empty-room {
              display: flex;
              justify-content: center;
              padding-top: 119px;
              font-size: 18px;
              color: #707070;
            }

            .room-items {
              .room-item {
                width: 100%;
                height: 100px;
                padding: 0 24px 0 10px;
                cursor: pointer;
                box-sizing: border-box;

                &.active {
                  background-color: #ffffef;
                }

                .room-info {
                  border-bottom: 0.5px solid #e8e8e8;
                  display: flex;
                  align-items: center;
                  height: 100%;
                  .left-logo-image {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: $primary;
                    color: #fff;
                    font-size: 2.4rem;
                    margin-right: 12px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }

                  .right-brand-chat {
                    flex: 1 1 0;
                    .brand-name {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;

                      #brandName {
                        font-size: 2rem;
                        color: #353535;
                        font-weight: 500;
                      }

                      #time {
                        font-size: 1.4rem;
                        color: #c8c8c8;
                      }
                    }

                    .last-chat {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-top: 5px;

                      #chatText {
                        width: 230px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        font-size: 1.6rem;
                      }

                      #newCount {
                        background-color: #fe3d3d;
                        color: #fff;
                        border-radius: 20px;
                        font-size: 1.4rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 3px 6px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      .right-chat-list {
        width: 810px;
        height: 100%;
        background-color: #f3f8ff;
        display: flex;
        flex-direction: column;

        .top-chat-list {
          flex: 1 1 0;
          display: flex;
          flex-direction: column;

          .chat-list-top {
            height: 100px;
            border-bottom: 1px solid #e2e7ef;
            box-sizing: border-box;
            padding: 0 28px;
            display: flex;
            align-items: center;

            .chat-brand-info {
              flex: 1 1 0;
              display: flex;
              align-items: center;

              .chat-top-brand-logo {
                width: 120px;
                height: 48px;
                margin-right: 12px;

                img {
                  width: 100%;
                  height: 100%;
                }
              }

              .chat-top-brand-name {
                font-size: 2rem;
                color: #353535;
                line-height: 1.5;

                div {
                  &:last-child {
                    font-size: 12px;
                    color: #888;
                  }
                }
              }
            }

            .move-brand-detail {
              width: 28px;
              height: 28px;
              cursor: pointer;

              i {
                font-size: 28px;
                color: #888;
              }
            }
          }

          .chat-list-body {
            flex: 1 1 0;
            overflow: hidden;

            .chat-item-list {
              height: 100%;
              padding: 28px 30px 0;
              overflow-y: scroll;
              box-sizing: border-box;
              -ms-overflow-style: none; /* IE and Edge */
              scrollbar-width: none; /* Firefox */

              &::-webkit-scrollbar {
                display: none;
              }

              .chat-item {
                #chatDate {
                  display: flex;
                  justify-content: center;
                  font-size: 14px;
                  color: #999;
                }

                .chatText {
                  margin-top: 23px;
                  padding: 13px 18px;
                  display: flex;
                  align-items: flex-end;
                  justify-content: flex-end;
                  word-break: break-all;

                  #date {
                    font-size: 14px;
                    color: #c8c8c8;
                  }

                  #text {
                    padding: 13px 18px;
                    max-width: 330px;
                    font-size: 1.6rem;

                    &.file-download {
                      color: #0000ee;
                      text-decoration: underline;
                      cursor: pointer;
                    }

                    img {
                      max-width: 330px;
                    }
                  }

                  &.me {
                    #text {
                      margin-left: 12px;
                      background-color: #ffdc51;
                      border-radius: 15px 0 15px 15px;
                    }
                  }

                  &.you {
                    flex-direction: row-reverse;

                    #text {
                      background-color: #fff;
                      border-radius: 0 15px 15px 15px;
                      margin-right: 12px;
                    }
                  }
                }
              }
            }
          }
        }

        .bottom-chat-input {
          height: 60px;
          display: flex;

          .input-box {
            flex: 1 1 0;
            position: relative;
            display: flex;
            align-items: center;

            .input-file {
              position: absolute;
              left: 10px;

              input[type='file'] {
                width: 0;
                height: 0;
                margin: 0;
                padding: 0;
              }

              label {
                cursor: pointer;
              }
            }

            input {
              width: 100%;
              height: 100%;
              border: none;
              padding-left: 64px;
              font-size: 16px;
              color: #191919;

              &::placeholder {
                color: #707070;
              }
            }
          }

          button {
            width: 60px;
            height: 60px;
            background-color: #ffdc51;
            border: none;
          }
        }
      }
    }
  }
}

@include mobile {
  #desktop {
    display: none;
  }

  footer {
    display: none;
  }

  .main {
    position: relative;
    .qna-chat {
      position: relative;

      .qna-chat-top {
        @include flex-center();
        position: sticky;
        width: 100%;
        top: 0;
        background-color: $primary;
        height: 60px;
        font-size: 2rem;
        color: #fff;
        z-index: 100;

        .home {
          position: absolute;
          width: 28px;
          right: 24px;
        }
      }

      .qna-chat-body {
        .qna-chat-body-top {
          .list-type {
            display: flex;
            height: 60px;
            padding: 15px 0;
            box-sizing: border-box;

            .top-menu {
              display: flex;
              flex: 1 1 0;
              justify-content: center;
              align-items: center;
              font-size: 1.8rem;
              color: #767676;
              cursor: pointer;

              &.active {
                color: #191919;
                font-weight: bold;
              }
            }

            .line {
              border-left: 1px solid #d2e4ff;
            }
          }

          .search-brand {
            height: 70px;
            background-color: #f8f8fa;
            padding: 12px 24px;
            box-sizing: border-box;

            .search-input {
              width: 100%;
              height: 100%;
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;

              input[type='text'] {
                width: 100%;
                height: 100%;
                border: none;
                padding: 0 56px;
                font-size: 1.6rem;
                color: #191919;
                box-sizing: border-box;

                &::placeholder {
                  color: #767676;
                }
              }

              img {
                position: absolute;

                &#search {
                  left: 20px;
                  width: 20px;
                }

                &#cancel {
                  right: 20px;
                  width: 20px;
                  cursor: pointer;
                }
              }
            }
          }
        }

        .qna-chat-body-room-list {
          .room-list {
            .empty-room {
              display: flex;
              justify-content: center;
              padding-top: 150px;
              font-size: 1.6rem;
              color: #191919;
            }

            .room-items {
              padding: 0 24px;
              width: 100%;
              box-sizing: border-box;
              .room-item {
                display: flex;
                align-items: center;
                padding: 20px 0;
                border-bottom: 1px solid #ededed;

                .left-logo-image {
                  width: 50px;
                  height: 50px;
                  border-radius: 50%;
                  background-color: $primary;
                  color: #fff;
                  font-size: 2.4rem;
                  margin-right: 12px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }

                .right-brand-chat {
                  flex: 1 1 0;
                  .brand-name {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 5px;

                    #brandName {
                      font-size: 1.4rem;
                      color: #191919;
                      font-weight: bold;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      height: 16px;
                      line-height: 16px;
                      word-wrap: break-word;
                      display: -webkit-box;
                      -webkit-line-clamp: 1;
                      -webkit-box-orient: vertical;
                    }

                    #time {
                      font-size: 1.2rem;
                      color: #767676;
                    }
                  }

                  .last-chat {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    #chatText {
                      font-size: 1.2rem;
                      color: #767676;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      height: 16px;
                      line-height: 16px;
                      word-wrap: break-word;
                      display: -webkit-box;
                      -webkit-line-clamp: 1;
                      -webkit-box-orient: vertical;
                    }

                    #newCount {
                      background-color: #fe3d3d;
                      color: #fff;
                      font-size: 1.2rem;
                      border-radius: 10px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      padding: 2px 4px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
