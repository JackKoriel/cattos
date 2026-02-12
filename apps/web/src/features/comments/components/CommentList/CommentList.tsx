import { Box, CircularProgress, Stack, Typography, Button } from '@cattos/ui'
import { PostCardContainer as PostCard } from '@/features/posts/components/PostCardContainer'
import { useFetchComments } from '@/hooks/useFetchComments'
import { CommentInput } from '../CommentInput/CommentInput'
import { CommentSkeleton } from '../CommentSkeleton'
import { usePostActions } from '@/hooks/posts/usePostActions'
import { useNavigate } from 'react-router-dom'

interface CommentListProps {
  postId: string
  onCommentCreated?: () => void
}

export const CommentList = ({ postId, onCommentCreated }: CommentListProps) => {
  const navigate = useNavigate()
  const {
    comments,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    addComment,
    replaceTempComment,
    removeComment,
  } = useFetchComments(postId)

  const { like, bookmark } = usePostActions()

  if (loading) {
    return <CommentSkeleton />
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
        onBeforeComment={(comment) => {
          addComment(comment)
          onCommentCreated?.()
        }}
        onCommentCreated={(serverComment, tempId) => {
          replaceTempComment(tempId, serverComment)
        }}
        onCommentFailed={(tempId) => removeComment(tempId)}
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
        <Stack spacing={2} alignItems="flex-start">
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ width: '80%' }}>
              <PostCard
                post={comment}
                onLike={like}
                onBookmark={bookmark}
                onOpen={(id) => navigate(`/post/${id}`)}
                onProfileClick={(username) => navigate(`/profile/${username}`)}
                showCommentButton={false}
                showRepostButton={false}
                showBookmarkButton={false}
                showShareButton={false}
              />
            </Box>
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
