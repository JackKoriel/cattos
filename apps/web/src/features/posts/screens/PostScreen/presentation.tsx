import { Box, IconButton, Typography, ArrowBackIcon, PawLoader, Stack } from '@cattos/ui'
import { PostCard } from '@cattos/ui'
import type { Post } from '@cattos/shared'
import { CommentList } from '@/features/comments/components'

export type PostScreenPresentationProps = {
  post: Post
  onBack: () => void
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
  onBack,
  onOpen,
  onProfileClick,
  onLike,
  onBookmark,
  onRepost,
  onShare,
  onCommentCreated,
}: PostScreenPresentationProps) => {
  const gradientBackground = 'linear-gradient(180deg, #A088F9 0%, #FFBA93 100%)'

  return (
    <Box display="flex" minHeight="100vh" width="100%">
      <Box
        flex={3}
        borderRight="1px solid rgba(255,255,255,0.2)"
        sx={{
          background: gradientBackground,
        }}
      >
        <Box
          p={2}
          position="sticky"
          top={0}
          zIndex={10}
          borderBottom="1px solid rgba(255,255,255,0.2)"
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          <IconButton size="small" onClick={onBack} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="white"
            sx={{ cursor: 'default', userSelect: 'none' }}
          >
            Post
          </Typography>
        </Box>

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
      </Box>

      <Box
        flex={1}
        p={3}
        sx={{
          display: { xs: 'none', md: 'block' },
          background: gradientBackground,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
          color="white"
          sx={{ cursor: 'default', userSelect: 'none' }}
        >
          Purrfect Finds ✨
        </Typography>
        <Box bgcolor="white" borderRadius={3} p={2} boxShadow="0 4px 12px rgba(0,0,0,0.1)">
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ cursor: 'default', userSelect: 'none' }}
          >
            fav ads
          </Typography>
          <Box
            p={2}
            bgcolor="#f5f5f5"
            borderRadius={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="h2" mb={1}>
              🐱
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center">
              Sample test.
            </Typography>
          </Box>
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
