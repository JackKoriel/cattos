import { Box, Typography } from '@mui/material'
import { PostFeed } from '@/components/post'

export const HomePage = () => {
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
        <PostFeed />
      </Box>

      <Box width={350} p={3} sx={{ display: { xs: 'none', md: 'block' } }}>
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
