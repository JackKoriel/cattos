import { Layout, Card, Avatar, Button, Skeleton } from '@cattos/ui'
import { Box, Typography, AppBar, Toolbar, Stack } from '@mui/material'

function App() {
  return (
    <Layout
      sidebar={
        <Box p={2}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Cattos 🐱
          </Typography>
          <Stack spacing={2}>
            <Button variant="contained" fullWidth>
              Home
            </Button>
            <Button variant="outlined" fullWidth>
              Profile
            </Button>
            <Button variant="outlined" fullWidth>
              Settings
            </Button>
          </Stack>
        </Box>
      }
    >
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" fontWeight="bold">
            Home
          </Typography>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Typography variant="h4" mb={3}>
          Hello World from Cattos! 🐱
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
              This is a placeholder cat post! More features coming in Phase 2. 🐾
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
    </Layout>
  )
}

export default App
