import { Box, PawLoader, PostSkeleton } from '@cattos/ui'

export const PostDetailSkeleton = () => {
  return (
    <Box p={2}>
      <PostSkeleton />
      <Box mt={4} display="flex" justifyContent="center">
        <PawLoader size="medium" text="Loading comments..." />
      </Box>
    </Box>
  )
}
