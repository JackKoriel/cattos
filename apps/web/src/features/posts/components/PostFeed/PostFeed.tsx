import { useRef, useCallback, forwardRef, useImperativeHandle, useState } from 'react'
import { Box, CircularProgress, Stack, Typography, Snackbar } from '@mui/material'
import { PostCard, PostSkeleton } from '@cattos/ui'
import { useFetchPosts } from '@/hooks/useFetchPosts'
import { apiClient } from '@/services/client'
import { Post } from '@cattos/shared'
import { CommentDialog } from '@/features/comments/components'
import { useNavigate } from 'react-router-dom'

export interface PostFeedHandle {
  refresh: () => void
}

interface PostFeedProps {
  authorId?: string
}
// TODO: optimize there and separate logic from presentation
export const PostFeed = forwardRef<PostFeedHandle, PostFeedProps>(({ authorId }, ref) => {
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
  const [commentDialogPost, setCommentDialogPost] = useState<Post | null>(null)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })

  const getScrollContainer = () => {
    let el = listRootRef.current?.parentElement as HTMLElement | null
    while (el) {
      if (el.scrollHeight > el.clientHeight) return el
      el = el.parentElement
    }
    return null
  }

  useImperativeHandle(ref, () => ({ refresh }), [refresh])

  const handleLike = async (id: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await apiClient.delete(`/posts/${id}/likes`)
      } else {
        await apiClient.post(`/posts/${id}/likes`)
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number } }
        if (axiosErr.response?.status === 409 || axiosErr.response?.status === 404) {
          return // State is already correct, silently succeed
        }
      }
      throw err
    }
  }

  const handleRepost = async (id: string) => {
    const response = await apiClient.post('/posts', {
      repostOfId: id,
      content: '',
      visibility: 'public',
    })
    return response.data.data as Post
  }

  const handleBookmark = async (id: string, isBookmarked: boolean) => {
    try {
      if (isBookmarked) {
        await apiClient.delete(`/posts/${id}/bookmarks`)
      } else {
        await apiClient.post(`/posts/${id}/bookmarks`)
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number } }
        if (axiosErr.response?.status === 409 || axiosErr.response?.status === 404) {
          return // State is already correct, silently succeed
        }
      }
      throw err
    }
  }

  const handleComment = async (postId: string) => {
    const existing = posts.find((p) => p._id === postId)
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
    const postId = commentDialogPost?._id
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
    const created = await handleRepost(id)

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
          loadMore()
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, loadingMore, hasMore, loadMore]
  )

  if (loading && posts.length === 0) {
    return (
      <Stack spacing={2} p={2}>
        {[1, 2, 3, 4, 5].map((n) => (
          <PostSkeleton key={n} />
        ))}
      </Stack>
    )
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
      <div ref={listRootRef}>
        <Stack spacing={2} p={2} pb={4}>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onRepost={handleRepostWithFeedback}
              onBookmark={handleBookmark}
              onComment={(postId) => {
                void handleComment(postId)
              }}
              onShare={handleShare}
              onOpen={(postId) => navigate(`/post/${postId}`)}
            />
          ))}

          {hasMore && <div ref={lastPostRef} style={{ height: 1 }} />}

          {loadingMore && (
            <Box
              sx={{
                position: 'sticky',
                bottom: 12,
                display: 'flex',
                justifyContent: 'center',
                py: 2,
                pointerEvents: 'none',
              }}
            >
              <CircularProgress size={22} thickness={5} sx={{ opacity: 0.85 }} />
            </Box>
          )}

          {!hasMore && posts.length > 0 && (
            <Typography variant="body2" color="text.secondary" align="center" py={2}>
              You've reached the end! 🐱
            </Typography>
          )}
        </Stack>
      </div>

      <CommentDialog
        open={!!commentDialogPost}
        onClose={handleCloseCommentDialog}
        post={commentDialogPost}
        onLike={handleLike}
        onBookmark={handleBookmark}
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
})

PostFeed.displayName = 'PostFeed'
