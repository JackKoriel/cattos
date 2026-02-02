export interface Post {
  _id: string
  authorId: string

  content: string
  mediaUrls?: string[]
  mediaType?: 'image' | 'video' | 'gif' | 'mixed'
  altText?: string

  parentPostId?: string
  rootPostId?: string
  threadDepth?: number

  repostOfId?: string
  isRepost?: boolean
  isQuote?: boolean

  likesCount?: number
  commentsCount?: number
  repostsCount?: number
  quotesCount?: number
  viewsCount?: number
  bookmarksCount?: number

  hashtags?: string[]
  mentions?: string[]
  urls?: string[]

  visibility?: 'public' | 'followers' | 'mentioned' | 'private'
  isDeleted?: boolean
  isPinned?: boolean
  isEdited?: boolean
  editedAt?: string

  isSensitive?: boolean
  sensitiveType?: 'nudity' | 'violence' | 'spoiler' | 'other'
  isHidden?: boolean
  reportCount?: number

  location?: {
    name: string
    coordinates?: {
      lat: number
      lng: number
    }
  }

  createdAt: string
  updatedAt: string
}
