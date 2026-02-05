import { useRef } from 'react'
import { Box, Typography } from '@mui/material'
import { PostFeed, CreatePost } from '@/components/post'

export interface PostFeedHandle {
  refresh: () => void
}

export const HomePage = () => {
  const feedRef = useRef<PostFeedHandle>(null)

  const handlePostCreated = () => {
    feedRef.current?.refresh()
  }

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
        >
          <Typography variant="h6" fontWeight="bold">
            Home
          </Typography>
        </Box>
        <CreatePost onPostCreated={handlePostCreated} />
        <PostFeed ref={feedRef} />
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
