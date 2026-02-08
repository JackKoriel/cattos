import { Box, Typography } from '@cattos/ui'
import type { ForwardedRef } from 'react'
import { CreatePost, PostFeed, type PostFeedHandle } from '@/features/posts/components'

export const HomeScreenPresentation = ({
  feedRef,
  onPostCreated,
}: {
  feedRef: ForwardedRef<PostFeedHandle>
  onPostCreated: () => void
}) => {
  const gradientBackground = 'linear-gradient(180deg, #A088F9 0%, #FFBA93 100%)'

  return (
    <Box display="flex" minHeight="100vh" width="100%">
      <Box
        flex={3}
        p={2}
        borderRight="1px solid rgba(255,255,255,0.2)"
        sx={{
          background: gradientBackground,
        }}
      >
        <Box mb={2} px={1}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="white"
            sx={{ cursor: 'default', userSelect: 'none' }}
          >
            Home
          </Typography>
        </Box>
        <CreatePost onPostCreated={onPostCreated} />
        <Box mt={2}>
          <PostFeed ref={feedRef} />
        </Box>
      </Box>

      {/* Right Sidebar - 25% of the 80% container = 20% of total width */}
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
