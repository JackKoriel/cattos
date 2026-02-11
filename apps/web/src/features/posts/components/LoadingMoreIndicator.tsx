import { Box, PawLoader } from '@cattos/ui'

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
      <PawLoader size="small" />
    </Box>
  )
}
