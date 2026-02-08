import { Dialog, DialogContent, Box, IconButton, Divider, CloseIcon } from '@cattos/ui'
import { PostCard } from '@cattos/ui'
import { Post } from '@cattos/shared'
import { useNavigate } from 'react-router-dom'
import { CommentList } from '../CommentList'

interface CommentDialogProps {
  open: boolean
  onClose: () => void
  post: Post | null
  onLike?: (id: string, isLiked: boolean) => Promise<void>
  onBookmark?: (id: string, isBookmarked: boolean) => Promise<void>
  onCommentCreated?: () => void
}

export const CommentDialog = ({
  open,
  onClose,
  post,
  onLike,
  onBookmark,
  onCommentCreated,
}: CommentDialogProps) => {
  const navigate = useNavigate()

  if (!post) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <Box display="flex" alignItems="center" p={1} borderBottom={1} borderColor="divider">
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
        <PostCard
          post={post}
          onLike={onLike}
          onBookmark={onBookmark}
          onProfileClick={(username) => navigate(`/profile/${username}`)}
        />
        <Divider />
        <CommentList postId={post.id} onCommentCreated={onCommentCreated} />
      </DialogContent>
    </Dialog>
  )
}
