import { Schema, model } from 'mongoose'
import { INotification } from '../interfaces/notification.interface.js'

const notificationSchema = new Schema<INotification>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: [
        'like',
        'comment',
        'follow',
        'mention',
        'repost',
        'quote',
        'reply',
        'welcome',
        'system',
      ],
      required: true,
    },
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },
    message: String,
    isRead: { type: Boolean, default: false },
    readAt: Date,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

notificationSchema.index({ recipientId: 1, createdAt: -1 })
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 })
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 })

export const Notification = model<INotification>('Notification', notificationSchema)
