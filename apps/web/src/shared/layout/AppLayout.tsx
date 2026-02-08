import { Box, Typography, Stack, CssBaseline } from '@cattos/ui'
import { Button } from '@cattos/ui'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthLogout, useAuthUser } from '@/stores/authStore'

export const AppLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthLogout()
  const user = useAuthUser()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const isHome = location.pathname === '/'
  const isProfile = location.pathname.startsWith('/profile')

  const gradientBackground = 'linear-gradient(180deg, #A088F9 0%, #FFBA93 100%)'

  return (
    <>
      <CssBaseline />
      <Box display="flex" width="100%" minHeight="100vh">
        <Box
          component="aside"
          width="20%"
          p={2}
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'sticky',
            top: 0,
            height: '100vh',
            background: gradientBackground,
            borderRight: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={3}
            sx={{ color: 'white', ml: 1, cursor: 'default', userSelect: 'none' }}
          >
            Cattos 🐱
          </Typography>
          <Stack spacing={2}>
            <Button
              variant={isHome ? 'orange' : 'contained'}
              fullWidth
              onClick={() => navigate('/')}
              sx={{
                justifyContent: 'flex-start',
                px: 3,
                color: isHome ? 'white' : 'text.primary',
                backgroundColor: isHome ? undefined : 'white',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: isHome ? undefined : '#f5f5f5',
                },
                boxShadow: 'none',
              }}
              startIcon={<span style={{ marginRight: 8 }}>🏠</span>}
            >
              Home
            </Button>
            <Button
              variant={isProfile ? 'orange' : 'contained'}
              fullWidth
              onClick={() => navigate(`/profile/${user?.username || 'me'}`)}
              sx={{
                justifyContent: 'flex-start',
                px: 3,
                color: isProfile ? 'white' : 'text.primary',
                backgroundColor: isProfile ? undefined : 'white',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: isProfile ? undefined : '#f5f5f5',
                },
              }}
              // TODO: change to site logo black cat
              startIcon={<span style={{ marginRight: 8 }}>🐱</span>}
            >
              Profile
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogout}
              sx={{
                justifyContent: 'flex-start',
                px: 3,
                color: 'text.primary',
                backgroundColor: 'white',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
              startIcon={<span style={{ marginRight: 8 }}>🚪</span>}
            >
              Logout
            </Button>
          </Stack>
        </Box>

        <Box width={{ xs: '100%', md: '80%' }} minWidth={0}>
          <Outlet />
        </Box>
      </Box>
    </>
  )
}
