import { Schema, model } from 'mongoose'
import { IPost } from '../interfaces/post.interface.js'

const postSchema = new Schema<IPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 280, trim: true },
    mediaUrls: {
      type: [String],
      default: [],
      validate: { validator: (v: string[]) => v.length <= 4, message: 'Maximum 4 media items' },
    },
    mediaType: { type: String, enum: ['image', 'video', 'gif', 'mixed'] },
    altText: { type: String, maxlength: 1000 },

    parentPostId: { type: Schema.Types.ObjectId, ref: 'Post' },
    rootPostId: { type: Schema.Types.ObjectId, ref: 'Post' },
    threadDepth: { type: Number, default: 0, min: 0 },

    repostOfId: { type: Schema.Types.ObjectId, ref: 'Post' },
    isRepost: { type: Boolean, default: false },
    isQuote: { type: Boolean, default: false },

    likesCount: { type: Number, default: 0, min: 0 },
    commentsCount: { type: Number, default: 0, min: 0 },
    repostsCount: { type: Number, default: 0, min: 0 },
    quotesCount: { type: Number, default: 0, min: 0 },
    viewsCount: { type: Number, default: 0, min: 0 },
    bookmarksCount: { type: Number, default: 0, min: 0 },

    hashtags: { type: [String], default: [] },
    mentions: { type: [String], default: [] },
    urls: { type: [String], default: [] },

    visibility: {
      type: String,
      enum: ['public', 'followers', 'mentioned', 'private'],
      default: 'public',
    },
    isDeleted: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    editedAt: Date,

    isSensitive: { type: Boolean, default: false },
    sensitiveType: { type: String, enum: ['nudity', 'violence', 'spoiler', 'other'] },
    isHidden: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0, min: 0 },

    location: {
      name: String,
      coordinates: { lat: Number, lng: Number },
    },
  },
  { timestamps: true }
)

postSchema.index({ authorId: 1, createdAt: -1 })
postSchema.index({ createdAt: -1 })
postSchema.index({ parentPostId: 1, createdAt: -1 })
postSchema.index({ rootPostId: 1, createdAt: 1 })
postSchema.index({ hashtags: 1, createdAt: -1 })
postSchema.index({ mentions: 1, createdAt: -1 })
postSchema.index({ likesCount: -1, createdAt: -1 })
postSchema.index({ repostOfId: 1 })
postSchema.index({ isDeleted: 1, visibility: 1 })
postSchema.index({ content: 'text' })

export const Post = model<IPost>('Post', postSchema)
