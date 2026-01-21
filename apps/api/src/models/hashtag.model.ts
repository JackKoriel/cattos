import { Schema, model } from 'mongoose'
import { IHashtag } from '../interfaces/hashtag.interface.js'

const hashtagSchema = new Schema<IHashtag>(
  {
    tag: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
    },
    postsCount: { type: Number, default: 0, min: 0 },
    lastUsedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

hashtagSchema.index({ tag: 1 }, { unique: true })
hashtagSchema.index({ postsCount: -1 })
hashtagSchema.index({ lastUsedAt: -1 })

export const Hashtag = model<IHashtag>('Hashtag', hashtagSchema)
