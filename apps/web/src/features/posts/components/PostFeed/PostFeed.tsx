import {
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Box, Stack, Typography, Snackbar, AdPostCard } from '@cattos/ui'
import { PostCardContainer as PostCard } from '@/features/posts/components/PostCardContainer'
import { FeedSkeleton, LoadingMoreIndicator } from '@/features/posts/components'
import { useFetchPosts } from '@/hooks/useFetchPosts'
import { apiClient } from '@/services/client'
import { usePostActions } from '@/hooks/posts/usePostActions'
import type { Ad, Post } from '@cattos/shared'
import { CommentDialog } from '@/features/comments/components'
import { useNavigate } from 'react-router-dom'
import { adsService } from '@/services/ads'

export interface PostFeedHandle {
  refresh: () => void
}

interface PostFeedProps {
  authorId?: string
  showAds?: boolean
}
// TODO: optimize there and separate logic from presentation
export const PostFeed = forwardRef<PostFeedHandle, PostFeedProps>(
  ({ authorId, showAds = false }, ref) => {
    const navigate = useNavigate()
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
    } = useFetchPosts(authorId)
    const listRootRef = useRef<HTMLDivElement | null>(null)
    const observer = useRef<IntersectionObserver | null>(null)
    const loadingMoreRef = useRef(false)
    // TODO: move ad logic to backend
    const seedRef = useRef<number>((Math.random() * 0xffffffff) >>> 0)
    const [commentDialogPost, setCommentDialogPost] = useState<Post | null>(null)
    const [postAds, setPostAds] = useState<Ad[]>([])
    const [loadingAds, setLoadingAds] = useState(false)
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
      open: false,
      message: '',
    })

    const shouldShowFeedAds = showAds && !authorId

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

    // move ad logic to the backend
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

    const getScrollContainer = () => {
      let el = listRootRef.current?.parentElement as HTMLElement | null
      while (el) {
        if (el.scrollHeight > el.clientHeight) return el
        el = el.parentElement
      }
      return null
    }

    useImperativeHandle(ref, () => ({ refresh }), [refresh])

    const { like, bookmark, repost } = usePostActions()

    const handleComment = async (postId: string) => {
      const existing = posts.find((p) => p.id === postId)
      if (existing) {
        setCommentDialogPost(existing)
        return
      }

      const response = await apiClient.get(`/posts/${postId}`)
      setCommentDialogPost(response.data.data)
    }

    const handleCloseCommentDialog = () => {
      setCommentDialogPost(null)
    }

    const handleCommentCreated = () => {
      const postId = commentDialogPost?.id
      if (!postId) return

      updatePost(postId, (prev) => ({ ...prev, commentsCount: (prev.commentsCount ?? 0) + 1 }))
      setCommentDialogPost((prev) =>
        prev ? { ...prev, commentsCount: (prev.commentsCount ?? 0) + 1 } : prev
      )
    }

    const handleShare = (id: string) => {
      const url = `${window.location.origin}/post/${id}`
      navigator.clipboard.writeText(url)
      setSnackbar({ open: true, message: 'Link copied to clipboard!' })
    }

    const handleRepostWithFeedback = async (id: string) => {
      const created = await repost(id)

      prependPost(created)
      updatePost(id, (prev) => ({ ...prev, repostsCount: (prev.repostsCount ?? 0) + 1 }))

      // Scroll to top to show the new repost
      const scrollEl = getScrollContainer()
      if (scrollEl) {
        scrollEl.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

      setSnackbar({ open: true, message: 'Reposted!' })
    }

    const handleCloseSnackbar = () => {
      setSnackbar({ open: false, message: '' })
    }

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

    if (loading && posts.length === 0) {
      return <FeedSkeleton count={5} />
    }

    if (!loading && !error && posts.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, p: 2 }}>
          <Typography variant="body1" color="text.secondary">
            No posts found. Be the first to post! 🐱
          </Typography>
        </Box>
      )
    }

    if (error) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )
    }

    return (
      <>
        <Box ref={listRootRef}>
          <Stack spacing={2} p={2} pb={4}>
            {renderedItems.map((item) => {
              if (item.type === 'ad') {
                return (
                  <AdPostCard
                    key={item.key}
                    ad={item.ad}
                    onClick={() => {
                      navigate('/coming-soon')
                    }}
                  />
                )
              }

              return (
                <PostCard
                  key={item.key}
                  post={item.post}
                  onLike={like}
                  onRepost={handleRepostWithFeedback}
                  onBookmark={bookmark}
                  onComment={(postId) => {
                    void handleComment(postId)
                  }}
                  onShare={handleShare}
                  onOpen={(postId) => navigate(`/post/${postId}`)}
                  onProfileClick={(username) => navigate(`/profile/${username}`)}
                />
              )
            })}

            {hasMore && <div ref={lastPostRef} style={{ height: 1 }} />}

            {loadingMore && <LoadingMoreIndicator />}

            {!hasMore && posts.length > 0 && (
              <Typography variant="body2" color="text.secondary" align="center" py={2}>
                You've reached the end! 🐱
              </Typography>
            )}
          </Stack>
        </Box>

        <CommentDialog
          open={!!commentDialogPost}
          onClose={handleCloseCommentDialog}
          post={commentDialogPost}
          onLike={like}
          onBookmark={bookmark}
          onCommentCreated={handleCommentCreated}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
        />
      </>
    )
  }
)

PostFeed.displayName = 'PostFeed'
