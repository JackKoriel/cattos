import { Box, Typography, Stack, PostCard } from '@cattos/ui'
import type { Post } from '@cattos/shared'
import { CommentList } from '@/features/comments/components'

export type PostScreenPresentationProps = {
  post: Post
  onOpen: (postId: string) => void
  onProfileClick: (username: string) => void
  onLike: (postId: string, isLiked: boolean) => Promise<void>
  onBookmark: (postId: string, isBookmarked: boolean) => Promise<void>
  onRepost: (postId: string) => Promise<void>
  onShare: (postId: string) => void
  onCommentCreated: () => void
}

export const PostScreenPresentation = ({
  post,
  onOpen,
  onProfileClick,
  onLike,
  onBookmark,
  onRepost,
  onShare,
  onCommentCreated,
}: PostScreenPresentationProps) => {
  return (
    <Stack spacing={2} p={2}>
      <PostCard
        post={post}
        onLike={onLike}
        onBookmark={onBookmark}
        onRepost={onRepost}
        onShare={onShare}
        onOpen={onOpen}
        onProfileClick={onProfileClick}
      />
      <CommentList postId={post.id} onCommentCreated={onCommentCreated} />
    </Stack>
  )
}

export const PostScreenError = ({ message }: { message: string }) => {
  return (
    <Box p={3}>
      <Typography color="error">{message}</Typography>
    </Box>
  )
}
