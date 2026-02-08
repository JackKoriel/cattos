import {
  Box,
  Typography,
  Stack,
  CssBaseline,
  IconButton,
  ArrowBackIcon,
  GRADIENTS,
} from '@cattos/ui'
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
  const isProfile = user?.username ? location.pathname.startsWith('/profile') : false

  const getHeaderInfo = () => {
    if (location.pathname === '/') return { title: 'Home', showBack: false }
    if (location.pathname.startsWith('/profile/')) {
      const parts = location.pathname.split('/')
      const username = parts[parts.length - 1]
      return { title: username || 'Profile', showBack: true }
    }
    if (location.pathname.startsWith('/post/')) return { title: 'Post', showBack: true }
    return { title: 'Feed', showBack: false }
  }

  const { title, showBack } = getHeaderInfo()

  return (
    <>
      <CssBaseline />
      <Box display="flex" width="100%" minHeight="100vh">
        {/* Left Sidebar - 20% */}
        <Box
          component="aside"
          width="20%"
          p={2}
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'sticky',
            top: 0,
            height: '100vh',
            background: GRADIENTS.main,
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

        {/* Middle Section - 60% */}
        <Box
          width={{ xs: '100%', md: '60%' }}
          minWidth={0}
          borderRight="1px solid rgba(255,255,255,0.2)"
          sx={{
            background: GRADIENTS.main,
            minHeight: '100vh',
          }}
        >
          {/* Persistent Header */}
          <Box
            p={2}
            position="sticky"
            top={0}
            zIndex={10}
            borderBottom="1px solid rgba(255,255,255,0.2)"
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              background: GRADIENTS.main,
              backdropFilter: 'blur(8px)',
              cursor: 'default',
              userSelect: 'none',
            }}
          >
            {showBack && (
              <IconButton size="small" onClick={() => navigate(-1)} sx={{ color: 'white' }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6" fontWeight="bold" color="white">
              {title}
            </Typography>
          </Box>

          <Box overflow="auto">
            <Outlet />
          </Box>
        </Box>

        {/* Right Sidebar - 20% */}
        <Box
          width="20%"
          p={3}
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'sticky',
            top: 0,
            height: '100vh',
            background: GRADIENTS.main,
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
    </>
  )
}
