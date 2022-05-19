<template>
  <Header />
  <main>
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
                    <div id="text" v-else>
                      <a :href="item.message">{{ item.fileOriginName }}</a>
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
</template>

<script lang="ts" setup>
import Header from '../common/Header.vue'
import Footer from '../common/Footer.vue'
import { useStore } from 'vuex'
import api from '../../config/axios.config'
import { Brand } from '../../types/brand'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { checkAlert, toastAlert } from '../../functions/alert'
import { ChatRoom, ChatMessage } from '../../types/chat'
import { Page } from '../../types/page'
import { io } from 'socket.io-client'

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
const searchInput = ref<HTMLInputElement>()
const message = ref<string>('')

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

const sendMessage = async () => {
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

const getNoReadCount = async () => {
  const result = await api.get(`/chat/read/count/${brandId.value}/COMPANY`)

  if (result.data.success) {
    noReadCount.value = result.data.count.count
  } else {
    checkAlert(result.data.errorMessage)
  }
}

const convertDate = (date: Date): string => {
  const messageDate = new Date(date)

  const ampm = messageDate.getHours() >= 12 ? '오후' : '오전'

  const hour =
    ampm === '오전'
      ? messageDate.getHours() === 0
        ? '12'
        : messageDate.getHours()
      : messageDate.getHours() > 12
      ? messageDate.getHours() - 12
      : messageDate.getHours()

  const minute =
    messageDate.getMinutes() < 10
      ? '0' + messageDate.getMinutes()
      : messageDate.getMinutes()

  return ampm + ' ' + hour + ':' + minute
}

const calcDate = (date: Date): string => {
  const today = new Date()
  const chatDate = new Date(date)

  const calcTodayDate = today.getFullYear() + today.getMonth() + today.getDate()
  const calcChatDate =
    chatDate.getFullYear() + chatDate.getMonth() + chatDate.getDate()

  const calcDate = calcTodayDate - calcChatDate

  if (today.getFullYear() === chatDate.getFullYear()) {
    if (calcDate === 0) {
      return convertDate(date)
    } else {
      return chatDate.getMonth() + 1 + '월 ' + chatDate.getDate() + '일'
    }
  } else {
    return (
      chatDate.getFullYear +
      '. ' +
      chatDate.getMonth() +
      1 +
      '. ' +
      chatDate.getDate()
    )
  }
}

const compareDate = (
  currentDate: Date,
  beforeDate: Date,
  index: number
): boolean => {
  if (index === 0) {
    return true
  } else {
    const current = new Date(currentDate)
    const before = new Date(beforeDate)

    const calcCurrentDate =
      current.getFullYear() + current.getMonth() + current.getDate()
    const calcBeforeDate =
      before.getFullYear() + before.getMonth() + before.getDate()
    const calcDate = calcCurrentDate - calcBeforeDate

    if (calcDate === 0) {
      return false
    } else {
      return true
    }
  }
}

const chatDateString = (date: Date): string => {
  const chatDate = new Date(date)

  const weekArr: string[] = ['일', '월', '화', '수', '목', '금', '토']

  const year = chatDate.getFullYear()
  const month =
    chatDate.getMonth() + 1 < 10
      ? '0' + (chatDate.getMonth() + 1)
      : chatDate.getMonth() + 1
  const dayOfMonth =
    chatDate.getDate() < 10 ? '0' + chatDate.getDate() : chatDate.getDate()
  const dayOfWeek = weekArr[chatDate.getDay()]

  return year + '. ' + month + '. ' + dayOfMonth + ' (' + dayOfWeek + ')'
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

onUnmounted(() => socket.disconnect())
</script>

<style lang="scss" scoped>
@import '@/scss/main';

@include desktop {
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

                  #date {
                    font-size: 14px;
                    color: #c8c8c8;
                  }

                  #text {
                    padding: 13px 18px;
                    max-width: 330px;
                    font-size: 1.6rem;

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
</style>
