import { Schema, model } from 'mongoose'
import { IBookmark } from '../interfaces/bookmark.interface.js'

const bookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true })
bookmarkSchema.index({ userId: 1, createdAt: -1 })

export const Bookmark = model<IBookmark>('Bookmark', bookmarkSchema)
