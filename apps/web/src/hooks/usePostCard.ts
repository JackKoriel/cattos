import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import type { Post } from '@cattos/shared'

export type UsePostActions = {
  onLike?: (id: string, isLiked: boolean) => Promise<void>
  onBookmark?: (id: string, isBookmarked: boolean) => Promise<void>
  onRepost?: (id: string) => Promise<Post | void>
  onShare?: (id: string) => void
  onComment?: (id: string) => void
  onOpen?: (id: string) => void
  onProfileClick?: (username: string) => void
}

export const usePostCard = (post: Post | null | undefined, actions: UsePostActions = {}) => {
  const actionPost = post && post.isRepost && post.repostOf ? post.repostOf : post
  const targetId = actionPost?.id ?? ''
  const isReshare = !!(post && post.isRepost && post.repostOf)

  const [liked, setLiked] = useState<boolean>(actionPost?.isLiked ?? false)
  const [bookmarked, setBookmarked] = useState<boolean>(actionPost?.isBookmarked ?? false)
  const [localLikesCount, setLocalLikesCount] = useState<number>(actionPost?.likesCount ?? 0)
  const [localRepostsCount, setLocalRepostsCount] = useState<number>(actionPost?.repostsCount ?? 0)
  const [shareActive, setShareActive] = useState<boolean>(false)
  const shareTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (shareTimeoutRef.current !== null) {
        window.clearTimeout(shareTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setLiked(actionPost?.isLiked ?? false)
  }, [targetId, actionPost?.isLiked])

  useEffect(() => {
    setBookmarked(actionPost?.isBookmarked ?? false)
  }, [targetId, actionPost?.isBookmarked])

  useEffect(() => {
    setLocalLikesCount(actionPost?.likesCount ?? 0)
  }, [targetId, actionPost?.likesCount])

  useEffect(() => {
    setLocalRepostsCount(actionPost?.repostsCount ?? 0)
  }, [targetId, actionPost?.repostsCount])

  const handleLike = async () => {
    if (!actions.onLike) return
    const wasLiked = liked
    try {
      setLiked(!wasLiked)
      setLocalLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1))
      await actions.onLike(targetId, wasLiked)
    } catch (err) {
      setLiked(wasLiked)
      setLocalLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1))
      throw err
    }
  }

  const handleBookmark = async () => {
    if (!actions.onBookmark) return
    const wasBookmarked = bookmarked
    try {
      setBookmarked(!wasBookmarked)
      await actions.onBookmark(targetId, wasBookmarked)
    } catch (err) {
      setBookmarked(wasBookmarked)
      throw err
    }
  }

  const handleRepost = async () => {
    if (!actions.onRepost) return
    const created = await actions.onRepost(targetId)
    setLocalRepostsCount((prev) => prev + 1)
    return created
  }

  const handleShare = () => {
    setShareActive(true)
    if (shareTimeoutRef.current !== null) {
      window.clearTimeout(shareTimeoutRef.current)
    }
    shareTimeoutRef.current = window.setTimeout(() => setShareActive(false), 900)

    if (actions.onShare) {
      actions.onShare(targetId)
    } else {
      const url = `${window.location.origin}/post/${targetId}`
      navigator.clipboard.writeText(url)
    }
  }

  const handleProfileClick = (e: MouseEvent) => {
    if (!actions.onProfileClick) return
    e.stopPropagation()
    actions.onProfileClick(actionPost?.author?.username ?? '')
  }

  const timeAgo = actionPost?.createdAt ? new Date(actionPost.createdAt).toISOString() : ''

  return {
    actionPost,
    isReshare,
    targetId,
    liked,
    bookmarked,
    localLikesCount,
    localRepostsCount,
    shareActive,
    timeAgo,
    displayName: actionPost?.author?.displayName ?? post?.author?.displayName ?? 'Cat User',
    username: actionPost?.author?.username ?? post?.author?.username ?? '',
    avatarSrc: actionPost?.author?.avatar,
    commentsValue: actionPost?.commentsCount ?? 0,
    mediaUrls: actionPost?.mediaUrls ?? [],
    handleLike,
    handleBookmark,
    handleRepost,
    handleShare,
    handleProfileClick,
  }
}

export default usePostCard
