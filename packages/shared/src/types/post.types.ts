export interface Post {
  id: string
  authorId: string

  author?: {
    id: string
    username: string
    displayName: string
    avatar?: string
  }

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

  // When the backend populates `repostOfId`, it is normalized into `repostOf`
  repostOf?: {
    id: string
    authorId: string
    author?: {
      id: string
      username: string
      displayName: string
      avatar?: string
    }
    content: string
    mediaUrls?: string[]
    mediaType?: 'image' | 'video' | 'gif' | 'mixed'
    altText?: string

    likesCount?: number
    commentsCount?: number
    repostsCount?: number
    bookmarksCount?: number

    isLiked?: boolean
    isBookmarked?: boolean

    createdAt: string
    updatedAt: string
  }

  likesCount?: number
  commentsCount?: number
  repostsCount?: number
  quotesCount?: number
  viewsCount?: number
  bookmarksCount?: number

  // User-specific interaction state (populated when user is authenticated)
  isLiked?: boolean
  isBookmarked?: boolean

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
