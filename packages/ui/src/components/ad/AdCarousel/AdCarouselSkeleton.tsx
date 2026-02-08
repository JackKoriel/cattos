import { Box } from '../../box'
import { Skeleton } from '../../skeleton'
import { Stack } from '../../stack'

export const AdCarouselSkeleton = () => {
  return (
    <Box
      sx={{
        cursor: 'default',
        userSelect: 'none',
        display: 'block',
        height: '388px',
      }}
    >
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: '0.35em', borderRadius: 1 }} />
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: '0.35em', borderRadius: 1 }} />

      <Stack direction="row" spacing={1} alignItems="center">
        <Skeleton variant="circular" width={28} height={28} sx={{ flexShrink: 0 }} />

        <Box flex={1}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height="260px"
            sx={{
              borderRadius: 2,
            }}
          />
        </Box>

        <Skeleton variant="circular" width={28} height={28} sx={{ flexShrink: 0 }} />
      </Stack>
    </Box>
  )
}
