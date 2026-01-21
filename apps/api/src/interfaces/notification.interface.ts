import { Types } from 'mongoose'

export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'mention'
  | 'repost'
  | 'quote'
  | 'reply'
  | 'welcome'
  | 'system'

export interface INotification {
  _id: Types.ObjectId
  recipientId: Types.ObjectId
  senderId?: Types.ObjectId
  type: NotificationType
  postId?: Types.ObjectId
  message?: string
  isRead: boolean
  readAt?: Date
  createdAt: Date
}
