import { Card } from '@cattos/ui'
import { Box, Typography, AppBar, Toolbar, Stack, Avatar, Skeleton } from '@mui/material'
import { useAuth } from '../context/AuthContext'

type UserLike = {
  username?: string
  displayName?: string
}

const isUserLike = (value: unknown): value is UserLike =>
  typeof value === 'object' && value !== null && ('username' in value || 'displayName' in value)

export const HomePage = () => {
  const { user } = useAuth()

  const safeUser = isUserLike(user) ? user : undefined
  const welcomeName = safeUser?.displayName || safeUser?.username || 'Guest'

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" fontWeight="bold">
            Home
          </Typography>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Typography variant="h4" mb={3}>
          Welcome, {welcomeName}! 🐱
        </Typography>

        <Stack spacing={2}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ mr: 2 }}>C</Avatar>
              <Box>
                <Typography fontWeight="bold">Cat User</Typography>
                <Typography variant="body2" color="text.secondary">
                  @catuser
                </Typography>
              </Box>
            </Box>
            <Typography>
              This is a placeholder cat post! Connected to Auth Context now. 🐾
            </Typography>
          </Card>

          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box flex={1}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
            <Skeleton variant="rectangular" height={80} />
          </Card>
        </Stack>
      </Box>
    </>
  )
}
