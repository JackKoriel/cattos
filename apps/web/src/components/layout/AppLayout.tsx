import { Layout } from '@cattos/ui'
import { Box, Typography, Stack, Button } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export const AppLayout = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
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
