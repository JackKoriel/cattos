import { Box, Button, Typography, GRADIENTS } from '@cattos/ui'
import { useNavigate } from 'react-router-dom'

export const ComingSoonPage = () => {
  const navigate = useNavigate()

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="flex-start"
      justifyContent="center"
      sx={{ background: GRADIENTS.main }}
      p={2}
      mt={8}
    >
      <Box
        bgcolor="white"
        borderRadius={3}
        p={4}
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 4px 12px rgba(0,0,0,0.1)"
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Work in progress ⚠️
        </Typography>
        <Box mt={3} display="flex" gap={1}>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
