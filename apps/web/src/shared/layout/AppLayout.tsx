import {
  Box,
  Typography,
  Stack,
  CssBaseline,
  IconButton,
  ArrowBackIcon,
  GRADIENTS,
  AdCarousel,
} from '@cattos/ui'
import { Button } from '@cattos/ui'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthLogout, useAuthUser } from '@/stores/authStore'
import type { Ad } from '@cattos/shared'
import { adsService } from '@/services/ads'

export const AppLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthLogout()
  const user = useAuthUser()

  const [sidebarAds, setSidebarAds] = useState<Ad[]>([])
  const [loadingAds, setLoadingAds] = useState(true)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    let mounted = true
    setLoadingAds(true)
    adsService
      .getSidebarAds()
      .then((ads) => {
        if (!mounted) return
        setSidebarAds(ads)
      })
      .catch(() => {
        console.warn('Failed to load sidebar ads, sidebar will be shown without ads')
      })
      .finally(() => {
        if (mounted) setLoadingAds(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const isHome = location.pathname === '/'
  const isProfileRoute = location.pathname.startsWith('/profile/')
  const viewedUsername = isProfileRoute ? location.pathname.split('/').pop() : undefined
  const isOwnProfile = user?.username && viewedUsername === user.username

  const getHeaderInfo = () => {
    if (isHome) return { title: 'Home', showBack: false }
    if (isProfileRoute) {
      return { title: viewedUsername || 'Profile', showBack: true }
    }
    if (location.pathname.startsWith('/post/')) return { title: 'Post', showBack: true }
    return { title: 'Feed', showBack: false }
  }

  const { title, showBack } = getHeaderInfo()

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
              variant={isOwnProfile ? 'orange' : 'contained'}
              fullWidth
              onClick={() => navigate(`/profile/${user?.username || 'me'}`)}
              sx={{
                justifyContent: 'flex-start',
                px: 3,
                color: isOwnProfile ? 'white' : 'text.primary',
                backgroundColor: isOwnProfile ? undefined : 'white',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: isOwnProfile ? undefined : '#f5f5f5',
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

        <Box
          width={{ xs: '100%', md: '60%' }}
          minWidth={0}
          borderRight="1px solid rgba(255,255,255,0.2)"
          sx={{
            background: GRADIENTS.main,
            minHeight: '100vh',
          }}
        >
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
          <Box bgcolor="white" borderRadius={3} p={2} boxShadow="0 4px 12px rgba(0,0,0,0.1)">
            <AdCarousel ads={sidebarAds} title="Purrfect Finds ✨" loading={loadingAds} />
          </Box>
        </Box>
      </Box>
    </>
  )
}
