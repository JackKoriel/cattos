import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Avatar, Button, Stack, CircularProgress } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { PostFeed } from '@/components/post'
import { apiClient, handleApiError } from '@/api/client'
import { User, ApiResponse } from '@cattos/shared'

export const ProfilePage = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await apiClient.get<ApiResponse<User>>(`/users/username/${username}`)
        if (response.data.success && response.data.data) {
          setUser(response.data.data)
        } else {
          setError('User not found')
        }
      } catch (err) {
        const apiError = handleApiError(err)
        setError(apiError.message)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchUser()
    }
  }, [username])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !user) {
    return (
      <Box p={2}>
        <Typography color="error">{error || 'User not found'}</Typography>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </Box>
    )
  }

  return (
    <Box>
      <Box p={2} borderBottom={1} borderColor="divider" display="flex" alignItems="center" gap={2}>
        <Button onClick={() => navigate(-1)} sx={{ minWidth: 'auto', p: 1, borderRadius: '50%' }}>
          <ArrowBack />
        </Button>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {user.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            0 posts {/* TODO: Add post count to user model or fetch */}
          </Typography>
        </Box>
      </Box>

      {/* Cover Image Placeholder */}
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
