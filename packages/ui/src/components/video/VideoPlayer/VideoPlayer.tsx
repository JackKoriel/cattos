import { Box } from '../../box'
import { useTheme } from '@mui/material/styles'
import type { Theme } from '../../../theme'

export type VideoPlayerProps = {
  src: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  playsInline?: boolean
  onClick?: React.MouseEventHandler<HTMLVideoElement>
  height?: string | number
  width?: string | number
  aspectRatio?: string
}

export const VideoPlayer = ({
  src,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = true,
  playsInline = true,
  onClick,
  height,
  width,
  aspectRatio,
}: VideoPlayerProps) => {
  const theme = useTheme<Theme>()
  return (
    <Box
      sx={{
        width: width ?? '100%',
        borderRadius: theme.radii.radix1,
        overflow: 'hidden',
        bgcolor: 'grey.200',
        height: height ?? '100%',
      }}
    >
      <Box
        component="video"
        src={src}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline={playsInline}
        onClick={onClick}
        sx={{
          width: '100%',
          height: height ? '100%' : 'auto',
          objectFit: height ? 'cover' : undefined,
          display: 'block',
          aspectRatio: aspectRatio ?? undefined,
        }}
      />
    </Box>
  )
}
