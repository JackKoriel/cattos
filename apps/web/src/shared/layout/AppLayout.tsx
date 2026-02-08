import { Layout } from '@cattos/ui'
import { Box, Typography, Stack, Button } from '@cattos/ui'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthLogout, useAuthUser } from '@/stores/authStore'

export const AppLayout = () => {
  const navigate = useNavigate()
  const logout = useAuthLogout()
  const user = useAuthUser()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <Layout
      sidebar={
        <Box p={2}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Cattos 🐱
          </Typography>
          <Stack spacing={2}>
            <Button variant="contained" fullWidth onClick={() => navigate('/')}>
              Home
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate(`/profile/${user?.username || 'me'}`)}
            >
              Profile
            </Button>
            <Button variant="outlined" fullWidth onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Box>
      }
    >
      <Outlet />
    </Layout>
  )
}
