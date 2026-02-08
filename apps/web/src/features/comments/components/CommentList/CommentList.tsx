import { Box, CircularProgress, Stack, Typography, Button } from '@cattos/ui'
import { PostCard } from '@cattos/ui'
import { useFetchComments } from '@/hooks/useFetchComments'
import { CommentInput } from '../CommentInput/CommentInput'
import { apiClient } from '@/services/client'
import { useNavigate } from 'react-router-dom'

interface CommentListProps {
  postId: string
  onCommentCreated?: () => void
}

export const CommentList = ({ postId, onCommentCreated }: CommentListProps) => {
  const navigate = useNavigate()
  const { comments, loading, loadingMore, error, hasMore, loadMore, addComment } =
    useFetchComments(postId)

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
          return
        }
      }
      throw err
    }
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
          return
        }
      }
      throw err
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={2}>
      <CommentInput
        postId={postId}
        onCommentAdded={(comment) => {
          addComment(comment)
          onCommentCreated?.()
        }}
      />

      {comments.length === 0 ? (
        <Box
          p={4}
          textAlign="center"
          bgcolor="white"
          borderRadius={3}
          boxShadow="0 4px 12px rgba(0,0,0,0.1)"
        >
          <Typography color="text.secondary">No replies yet. Be the first to reply!</Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {comments.map((comment) => (
            <PostCard
              key={comment.id}
              post={comment}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onOpen={(id) => navigate(`/post/${id}`)}
              onProfileClick={(username) => navigate(`/profile/${username}`)}
              showCommentButton={false}
              showRepostButton={false}
              showBookmarkButton={false}
              showShareButton={false}
            />
          ))}

          {hasMore && (
            <Box display="flex" justifyContent="center" p={2}>
              <Button onClick={loadMore} disabled={loadingMore} sx={{ color: 'white' }}>
                {loadingMore ? <CircularProgress size={20} color="inherit" /> : 'Load more replies'}
              </Button>
            </Box>
          )}
        </Stack>
      )}
    </Stack>
  )
}
