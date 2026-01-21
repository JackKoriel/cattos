import { Schema, model } from 'mongoose'
import { ILike } from '../interfaces/like.interface.js'

const likeSchema = new Schema<ILike>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

likeSchema.index({ userId: 1, postId: 1 }, { unique: true })
likeSchema.index({ postId: 1, createdAt: -1 })
likeSchema.index({ userId: 1, createdAt: -1 })

export const Like = model<ILike>('Like', likeSchema)
