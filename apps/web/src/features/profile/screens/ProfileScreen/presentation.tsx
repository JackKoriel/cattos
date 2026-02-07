import { Box, Typography, Avatar, Button, Stack, CircularProgress, ArrowBackIcon } from '@cattos/ui'
import type { User } from '@cattos/shared'
import { PostFeed } from '@/features/posts/components'

export const ProfileScreenLoading = () => {
  return (
    <Box display="flex" justifyContent="center" p={4}>
      <CircularProgress />
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
  return (
    <Box>
      <Box p={2} borderBottom={1} borderColor="divider" display="flex" alignItems="center" gap={2}>
        <Button onClick={onBack} sx={{ minWidth: 'auto', p: 1, borderRadius: '50%' }}>
          <ArrowBackIcon />
        </Button>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {user.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            0 posts
          </Typography>
        </Box>
      </Box>

      <Box bgcolor="grey.300" height={150} />

      <Box px={2} pb={2} borderBottom={1} borderColor="divider">
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
          <Button variant="outlined" sx={{ borderRadius: 20 }}>
            Edit Profile
          </Button>
        </Box>
        <Typography variant="h6" fontWeight="bold">
          {user.displayName || user.username}
        </Typography>
        <Typography color="text.secondary" variant="body2" gutterBottom>
          @{user.username}
        </Typography>
        <Typography variant="body1" paragraph>
          {user.bio || 'No bio yet.'}
        </Typography>

        <Stack direction="row" spacing={2}>
          <Typography variant="body2">
            <b>0</b>{' '}
            <Box component="span" color="text.secondary">
              Following
            </Box>
          </Typography>
          <Typography variant="body2">
            <b>0</b>{' '}
            <Box component="span" color="text.secondary">
              Followers
            </Box>
          </Typography>
        </Stack>
      </Box>

      <PostFeed authorId={user.id} />
    </Box>
  )
}
