import { Types } from 'mongoose'

export interface IPost {
  _id: Types.ObjectId
  authorId: Types.ObjectId

  content: string
  mediaUrls: string[]
  mediaType?: 'image' | 'video' | 'gif' | 'mixed'
  altText?: string

  parentPostId?: Types.ObjectId
  rootPostId?: Types.ObjectId
  threadDepth: number

  repostOfId?: Types.ObjectId
  isRepost: boolean
  isQuote: boolean

  likesCount: number
  commentsCount: number
  repostsCount: number
  quotesCount: number
  viewsCount: number
  bookmarksCount: number

  hashtags: string[]
  mentions: string[]
  urls: string[]

  visibility: 'public' | 'followers' | 'mentioned' | 'private'
  isDeleted: boolean
  isPinned: boolean
  isEdited: boolean
  editedAt?: Date

  isSensitive: boolean
  sensitiveType?: 'nudity' | 'violence' | 'spoiler' | 'other'
  isHidden: boolean
  reportCount: number

  location?: {
    name: string
    coordinates?: {
      lat: number
      lng: number
    }
  }

  createdAt: Date
  updatedAt: Date
}
