import { Paper, Typography, Box, Button, Container } from '@cattos/ui'
import { useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'
import backgroundCity from '@/assets/backgrounds/background_city.jpg'
import appLogoBig from '@/assets/logos/app_logo_big.png'

interface AuthCardProps {
  children: ReactNode
  mode: 'login' | 'register'
}

export const AuthCard = ({ children, mode }: AuthCardProps) => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${backgroundCity})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: 12,
      }}
    >
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            userSelect: 'none',
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) e.preventDefault()
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={appLogoBig} alt="Cattos Logo" width={180} height={180} draggable={false} />
          </Box>
          <Paper
            elevation={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 4,
              borderRadius: 4,
              width: '100%',
              maxWidth: 600,
              minHeight: 480,
              userSelect: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
            }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) e.preventDefault()
            }}
          >
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Welcome back!
            </Typography>

            <Box
              sx={{
                display: 'flex',
                width: '100%',
                mb: 3,
                bgcolor: '#f5f5f5',
                p: 0.5,
                borderRadius: 2,
              }}
            >
              <Button
                fullWidth
                variant={mode === 'login' ? 'primary' : 'text'}
                onClick={() => navigate('/login')}
                sx={{
                  borderRadius: 1.5,
                  ...(mode === 'login' ? {} : { color: '#666666' }),
                }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant={mode === 'register' ? 'primary' : 'text'}
                onClick={() => navigate('/register')}
                sx={{
                  borderRadius: 1.5,
                  ...(mode === 'register' ? {} : { color: '#666666' }),
                }}
              >
                Create Account
              </Button>
            </Box>

            {children}
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}
