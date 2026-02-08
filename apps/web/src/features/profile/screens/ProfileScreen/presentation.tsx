import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Stack,
  PawLoader,
  ArrowBackIcon,
} from '@cattos/ui'
import type { User } from '@cattos/shared'
import { PostFeed } from '@/features/posts/components'

export const ProfileScreenLoading = () => {
  return (
    <Box display="flex" justifyContent="center" p={8}>
      <PawLoader size="large" text="Fetching profile..." />
    </Box>
  )
}

export const ProfileScreenError = ({
  message,
  onGoHome,
}: {
  message: string
  onGoHome: () => void
}) => {
  return (
    <Box p={2}>
      <Typography color="error">{message}</Typography>
      <Button onClick={onGoHome}>Go Home</Button>
    </Box>
  )
}

export const ProfileScreenPresentation = ({ user, onBack }: { user: User; onBack: () => void }) => {
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
          borderBottom="1px solid rgba(255,255,255,0.2)"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <IconButton onClick={onBack} sx={{ p: 1, color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="white">
              {user.username}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              0 posts
            </Typography>
          </Box>
        </Box>
        <Box
          pb={3}
          m={2}
          bgcolor="white"
          borderRadius={3}
          boxShadow="0 4px 12px rgba(0,0,0,0.1)"
          sx={{ transition: 'box-shadow 0.2s' }}
        >
          <Box
            sx={{
              height: 150,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: 'grey.300',
            }}
          />
          <Box px={2} pb={2}>
            <Box mt={-6} mb={2} display="flex" justifyContent="space-between" alignItems="flex-end">
              <Avatar
                src={user.avatar}
                alt={user.username}
                sx={{
                  width: 120,
                  height: 120,
                  border: '4px solid',
                  borderColor: 'background.paper',
                }}
              />
              <Button
                variant="contained"
                sx={{
                  borderRadius: 20,
                  backgroundColor: '#ff9800',
                  color: 'white',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#f57c00',
                    boxShadow: 'none',
                  },
                }}
              >
                Edit Profile
              </Button>
            </Box>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              {user.displayName || user.username}
            </Typography>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              @{user.username}
            </Typography>
            <Typography variant="body1" paragraph color="text.primary">
              {user.bio || 'No bio yet.'}
            </Typography>

            <Stack direction="row" spacing={2}>
              <Typography variant="body2" color="text.primary">
                <b>0</b>{' '}
                <Box component="span" color="text.secondary">
                  Following
                </Box>
              </Typography>
              <Typography variant="body2" color="text.primary">
                <b>0</b>{' '}
                <Box component="span" color="text.secondary">
                  Followers
                </Box>
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Box>
          <PostFeed authorId={user.id} />
        </Box>
      </Box>

      {/* Right Sidebar - copied from HomeScreen for consistency */}
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
