import { Box, CircularProgress } from '@cattos/ui'

export const CommentSkeleton = () => {
  return (
    <Box display="flex" justifyContent="center" p={4}>
      <CircularProgress size={24} />
    </Box>
  )
}
