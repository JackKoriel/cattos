import { Box, IconButton, Typography, ArrowBackIcon, PawLoader } from '@cattos/ui'
import { PostCard } from '@cattos/ui'
import type { Post } from '@cattos/shared'
import { CommentList } from '@/features/comments/components'

export type PostScreenPresentationProps = {
  post: Post
  onBack: () => void
  onOpen: (postId: string) => void
  onLike: (postId: string, isLiked: boolean) => Promise<void>
  onBookmark: (postId: string, isBookmarked: boolean) => Promise<void>
  onRepost: (postId: string) => Promise<void>
  onShare: (postId: string) => void
  onCommentCreated: () => void
}

export const PostScreenPresentation = ({
  post,
  onBack,
  onOpen,
  onLike,
  onBookmark,
  onRepost,
  onShare,
  onCommentCreated,
}: PostScreenPresentationProps) => {
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
          <IconButton size="small" onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            Post
          </Typography>
        </Box>

        <Box p={2} borderBottom={1} borderColor="divider">
          <PostCard
            post={post}
            onLike={onLike}
            onBookmark={onBookmark}
            onRepost={onRepost}
            onShare={onShare}
            onOpen={onOpen}
          />
        </Box>

        <CommentList postId={post._id} onCommentCreated={onCommentCreated} />
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

export const PostScreenLoading = () => {
  return (
    <Box display="flex" justifyContent="center" p={8}>
      <PawLoader size="medium" text="Loading post..." />
    </Box>
  )
}

export const PostScreenError = ({ message }: { message: string }) => {
  return (
    <Box p={3}>
      <Typography color="error">{message}</Typography>
    </Box>
  )
}
