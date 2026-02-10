import { useCallback } from 'react'
import { postsService } from '@/services/posts'

export const usePostActions = () => {
  const like = useCallback(async (postId: string, isLiked: boolean) => {
    if (isLiked) {
      await postsService.unlike(postId)
    } else {
      await postsService.like(postId)
    }
  }, [])

  const bookmark = useCallback(async (postId: string, isBookmarked: boolean) => {
    if (isBookmarked) {
      await postsService.unbookmark(postId)
    } else {
      await postsService.bookmark(postId)
    }
  }, [])

  const repost = useCallback(async (postId: string) => {
    return await postsService.repost(postId)
  }, [])

  const share = useCallback(async (postId: string) => {
    const url = postsService.shareUrl(postId)
    await navigator.clipboard.writeText(url)
  }, [])

  return { like, bookmark, repost, share }
}

export type UsePostActions = ReturnType<typeof usePostActions>
