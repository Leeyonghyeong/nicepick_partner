import { Brand } from './brand'
import { User } from './auth'

export interface ChatRoom {
  id: string
  brandId: string
  userId: string
  lastChatMessage: string
  createAt: Date
  updateAt: Date
  brand: Brand
  user: User
}

export interface ChatMessage {
  id: string
  message: string
  isUserRead: boolean
  isBrandRead: boolean
  senderId: string
  type: string
  createAt: Date
  chatRoomId: string
}
