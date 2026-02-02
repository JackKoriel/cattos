import { Box, CircularProgress, Typography } from '@mui/material'
import { PostCard } from '@cattos/ui'
import { useFetchPosts } from '@/hooks/useFetchPosts'

export const PostFeed = () => {
  const { posts, loading, error } = useFetchPosts()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </Box>
  )
}
