import { Schema, model } from 'mongoose'
import { IFollow } from '../interfaces/follow.interface.js'

const followSchema = new Schema<IFollow>(
  {
    followerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followingId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true })
followSchema.index({ followerId: 1, createdAt: -1 })
followSchema.index({ followingId: 1, createdAt: -1 })

export const Follow = model<IFollow>('Follow', followSchema)
