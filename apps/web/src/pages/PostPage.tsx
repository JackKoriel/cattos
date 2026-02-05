import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, CircularProgress, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { PostCard } from '@cattos/ui'
import { Post } from '@cattos/shared'
import { apiClient, handleApiError } from '@/api/client'
import { CommentList } from '@/components/comment'

export const PostPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const postId = useMemo(() => id ?? '', [id])

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return
      setLoading(true)
      setError(null)
      try {
        const response = await apiClient.get(`/posts/${postId}`)
        setPost(response.data.data)
      } catch (err) {
        const apiError = handleApiError(err)
        setError(apiError.message)
      } finally {
        setLoading(false)
      }
    }

    void fetchPost()
  }, [postId])

  const handleLike = async (targetId: string, isLiked: boolean) => {
    if (isLiked) {
      await apiClient.delete(`/posts/${targetId}/likes`)
    } else {
      await apiClient.post(`/posts/${targetId}/likes`)
    }
  }

  const handleBookmark = async (targetId: string, isBookmarked: boolean) => {
    if (isBookmarked) {
      await apiClient.delete(`/posts/${targetId}/bookmarks`)
    } else {
      await apiClient.post(`/posts/${targetId}/bookmarks`)
    }
  }

  const handleRepost = async (targetId: string) => {
    await apiClient.post('/posts', { repostOfId: targetId, content: '', visibility: 'public' })
  }

  const handleShare = (targetId: string) => {
    const url = `${window.location.origin}/post/${targetId}`
    navigator.clipboard.writeText(url)
  }

  const handleCommentCreated = () => {
    setPost((prev) => (prev ? { ...prev, commentsCount: (prev.commentsCount ?? 0) + 1 } : prev))
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress size={28} />
      </Box>
    )
  }

  if (error || !post) {
    return (
      <Box p={3}>
        <Typography color="error">{error ?? 'Post not found'}</Typography>
      </Box>
    )
  }

  return (
    <Box display="flex" height="100%">
      <Box flex={1} borderRight={1} borderColor="divider">
        <Box
          p={2}
          position="sticky"
          top={0}
          bgcolor="background.paper"
          zIndex={10}
          borderBottom={1}
          borderColor="divider"
          display="flex"
          alignItems="center"
          gap={1}
        >
          <IconButton size="small" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            Post
          </Typography>
        </Box>

        <Box p={2} borderBottom={1} borderColor="divider">
          <PostCard
            post={post}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onRepost={handleRepost}
            onShare={handleShare}
            onOpen={(targetId) => navigate(`/post/${targetId}`)}
          />
        </Box>

        <CommentList postId={post._id} onCommentCreated={handleCommentCreated} />
      </Box>

      <Box width={280} p={3} sx={{ display: { xs: 'none', md: 'block' } }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          fav ads
        </Typography>
        <Box bgcolor="action.hover" height={200} borderRadius={4} p={2}>
          <Typography variant="body2" color="text.secondary">
            Ad Space 🐱
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
