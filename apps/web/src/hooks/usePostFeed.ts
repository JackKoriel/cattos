import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFetchPosts } from '@/hooks/useFetchPosts'
import { adsService } from '@/services/ads'
import { apiClient } from '@/services/client'
import type { Ad, Post } from '@cattos/shared'

export function usePostFeed(authorId?: string, showAds = false) {
  const {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    updatePost,
    prependPost,
    replaceTempPost,
    refreshPost,
    refreshUser,
    removePost,
  } = useFetchPosts(authorId)

  const listRootRef = useRef<HTMLDivElement | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)
  const loadingMoreRef = useRef(false)
  const seedRef = useRef<number>((Math.random() * 0xffffffff) >>> 0)

  const [postAds, setPostAds] = useState<Ad[]>([])
  const [loadingAds, setLoadingAds] = useState(false)

  const shouldShowFeedAds = showAds && !authorId

  const [commentDialogPost, setCommentDialogPost] = useState<Post | null>(null)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })

  useEffect(() => {
    loadingMoreRef.current = loadingMore
  }, [loadingMore])

  useEffect(() => {
    if (!shouldShowFeedAds) return
    let mounted = true
    setLoadingAds(true)

    adsService
      .getPostAds()
      .then((ads) => {
        if (!mounted) return
        setPostAds(ads)
      })
      .catch(() => {
        console.warn('Failed to load post ads, feed will be shown without ads')
      })
      .finally(() => {
        if (mounted) setLoadingAds(false)
      })

    return () => {
      mounted = false
    }
  }, [shouldShowFeedAds])

  const pickAdForSlot = useCallback(
    (slotIndex: number): Ad | null => {
      if (!postAds.length) return null
      const mixed = (seedRef.current + (slotIndex + 1) * 2654435761) >>> 0
      const idx = mixed % postAds.length
      return postAds[idx] ?? null
    },
    [postAds]
  )

  const renderedItems = useMemo(() => {
    if (!shouldShowFeedAds || (postAds.length === 0 && !loadingAds)) {
      return posts.map((post) => ({ type: 'post' as const, key: post.id, post }))
    }

    const items: Array<
      | { type: 'post'; key: string; post: Post }
      | { type: 'ad'; key: string; ad?: Ad; loading?: boolean }
    > = []

    let slotIndex = 0
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      items.push({ type: 'post', key: post.id, post })

      if ((i + 1) % 3 !== 0) continue

      if (loadingAds) {
        items.push({ type: 'ad', key: `ad-loading-${slotIndex}`, loading: true })
        slotIndex++
      } else {
        const ad = pickAdForSlot(slotIndex)
        if (ad) {
          items.push({ type: 'ad', key: `ad-${slotIndex}`, ad })
          slotIndex++
        }
      }
    }

    return items
  }, [posts, pickAdForSlot, postAds.length, shouldShowFeedAds, loadingAds])

  const getScrollContainer = useCallback(() => {
    let el = listRootRef.current?.parentElement as HTMLElement | null
    while (el) {
      if (el.scrollHeight > el.clientHeight) return el
      el = el.parentElement
    }
    return null
  }, [])

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          if (loadingMoreRef.current) return
          loadingMoreRef.current = true
          loadMore()
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, loadingMore, hasMore, loadMore]
  )

  const handleComment = useCallback(
    async (postId: string) => {
      const existing = posts.find((p) => p.id === postId)
      if (existing) {
        setCommentDialogPost(existing)
        return
      }

      const response = await apiClient.get(`/posts/${postId}`)
      setCommentDialogPost(response.data.data)
    },
    [posts]
  )

  const handleCloseCommentDialog = useCallback(() => setCommentDialogPost(null), [])

  const handleCommentCreated = useCallback(() => {
    const postId = commentDialogPost?.id
    if (!postId) return

    updatePost(postId, (prev) => ({ ...prev, commentsCount: (prev.commentsCount ?? 0) + 1 }))
    setCommentDialogPost((prev) =>
      prev ? { ...prev, commentsCount: (prev.commentsCount ?? 0) + 1 } : prev
    )
  }, [commentDialogPost, updatePost])

  const handleShare = useCallback((id: string) => {
    const url = `${window.location.origin}/post/${id}`
    navigator.clipboard.writeText(url)
    setSnackbar({ open: true, message: 'Link copied to clipboard!' })
  }, [])

  const handleCloseSnackbar = useCallback(() => setSnackbar({ open: false, message: '' }), [])

  const showSnackbar = useCallback((message: string) => setSnackbar({ open: true, message }), [])

  return {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    updatePost,
    prependPost,
    replaceTempPost,
    refreshPost,
    refreshUser,
    removePost,
    listRootRef,
    renderedItems,
    lastPostRef,
    getScrollContainer,
    loadingAds,
    commentDialogPost,
    handleComment,
    handleCloseCommentDialog,
    handleCommentCreated,
    snackbar,
    handleShare,
    handleCloseSnackbar,
    showSnackbar,
  }
}

export default usePostFeed
