import { Card, CardContent, CardHeader, Skeleton, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { Theme } from '../../../theme'

export const PostSkeleton = () => {
  const theme = useTheme<Theme>()
  return (
    <Card variant="outlined" sx={{ display: 'flex', p: 2, borderRadius: theme.radii.radix2 }}>
      <Box sx={{ mr: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <CardHeader
          disableTypography
          sx={{ p: 0, mb: 1 }}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Skeleton variant="text" width={100} sx={{ mr: 1 }} />
              <Skeleton variant="text" width={60} />
            </Box>
          }
        />
        <CardContent sx={{ p: 0, mb: 1 }}>
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="40%" />
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: '425px' }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
      </Box>
    </Card>
  )
}
