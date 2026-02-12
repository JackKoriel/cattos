import type { Post } from '@cattos/shared'

export const generateTempId = (): string =>
  `temp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export function createTempPost({
  id = generateTempId(),
  author,
  content,
  mediaUrls,
  parentPostId,
}: {
  id?: string
  author: { id: string; username: string; displayName: string; avatar?: string }
  content: string
  mediaUrls?: string[]
  parentPostId?: string
}): Post {
  const now = new Date().toISOString()
  return {
    id,
    authorId: author.id,
    author: {
      id: author.id,
      username: author.username,
      displayName: author.displayName,
      avatar: author.avatar,
    },
    content,
    mediaUrls,
    parentPostId,
    likesCount: 0,
    commentsCount: 0,
    repostsCount: 0,
    bookmarksCount: 0,
    isLiked: false,
    isBookmarked: false,
    visibility: 'public',
    createdAt: now,
    updatedAt: now,
  }
}

export function createTempComment({
  id = generateTempId(),
  author,
  content,
  parentPostId,
}: {
  id?: string
  author: { id: string; username: string; displayName: string; avatar?: string }
  content: string
  parentPostId: string
}): Post {
  return createTempPost({ id, author, content, parentPostId })
}

export default { generateTempId, createTempPost, createTempComment }
