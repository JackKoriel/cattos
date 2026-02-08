import { Box } from '../../box'
import { Card } from '../../card'
import { Skeleton } from '../../skeleton'

export const AdPostCardSkeleton = () => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: 'none',
        border: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <Box p={2} bgcolor="white">
        <Skeleton variant="text" width="40%" height={24} sx={{ borderRadius: 1 }} />
      </Box>

      <Box p={2} pt={0} bgcolor="white">
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{
            pt: '56.25%', // 16:9 aspect ratio
            borderRadius: 2,
          }}
        />
      </Box>
    </Card>
  )
}
