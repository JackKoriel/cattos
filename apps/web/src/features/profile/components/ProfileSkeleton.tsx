import { Box, Skeleton, Stack, PawLoader, useAppTheme } from '@cattos/ui'

export const ProfileSkeleton = () => {
  const appTheme = useAppTheme()
  return (
    <Box>
      <Box
        m={2}
        bgcolor="white"
        borderRadius={appTheme.radii.radix2}
        boxShadow="0 4px 12px rgba(0,0,0,0.1)"
        overflow="hidden"
      >
        <Skeleton variant="rectangular" height={150} />
        <Box px={2} pb={3}>
          <Box mt={-6} mb={2} display="flex" justifyContent="space-between" alignItems="flex-end">
            <Skeleton
              variant="circular"
              width={120}
              height={120}
              sx={{ border: '4px solid white' }}
            />
          </Box>
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="text" width="20%" height={20} />
          <Box mt={2}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Box>
          <Stack direction="row" spacing={2} mt={2}>
            <Skeleton variant="text" width={80} />
            <Skeleton variant="text" width={80} />
          </Stack>
        </Box>
      </Box>
      <Box p={4} display="flex" justifyContent="center">
        <PawLoader size="medium" text="Loading posts..." />
      </Box>
    </Box>
  )
}
