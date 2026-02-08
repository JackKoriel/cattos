import { Box, CircularProgress } from '@cattos/ui'

// TODO: confirm postioning and style of loading - paw or circle
export const LoadingMoreIndicator = () => {
  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 12,
        display: 'flex',
        justifyContent: 'center',
        py: 2,
        pointerEvents: 'none',
      }}
    >
      <CircularProgress size={22} thickness={5} sx={{ opacity: 0.85 }} />
    </Box>
  )
}
