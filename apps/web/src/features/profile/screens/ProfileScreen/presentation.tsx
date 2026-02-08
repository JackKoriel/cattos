import { Box, Typography, Avatar, Button, Stack } from '@cattos/ui'
import type { User } from '@cattos/shared'
import { PostFeed } from '@/features/posts/components'

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

export const ProfileScreenPresentation = ({ user }: { user: User }) => {
  return (
    <Box>
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
  )
}
