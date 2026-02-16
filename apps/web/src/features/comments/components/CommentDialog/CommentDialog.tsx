import { Dialog, DialogContent, Box, IconButton, CloseIcon, useAppTheme } from '@cattos/ui'
import { PostCardContainer as PostCard } from '@/features/posts/components/PostCardContainer'
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

  const appTheme = useAppTheme()

  if (!post) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: appTheme.radii.radix2,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="flex-end" padding={2}>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent
        sx={{
          p: 0,
          overflowY: 'auto',
          flex: '1 1 auto',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
          <PostCard
            post={post}
            onLike={onLike}
            onBookmark={onBookmark}
            onProfileClick={(username) => navigate(`/profile/${username}`)}
          />
          <CommentList postId={post.id} onCommentCreated={onCommentCreated} />
        </Box>
      </DialogContent>
    </Dialog>
  )
}
