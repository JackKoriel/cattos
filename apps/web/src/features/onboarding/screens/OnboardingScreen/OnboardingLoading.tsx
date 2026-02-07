import { Box, Stack, PawLoader } from '@cattos/ui'
import backgroundCity from '@/assets/backgrounds/background_city.jpg'

export const OnboardingLoading = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundImage: `url(${backgroundCity})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
        <PawLoader size="large" text="Creating your purr-fect profile..." color="white" />
      </Stack>
    </Box>
  )
}
