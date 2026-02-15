import { Box } from '../../box'

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
  return (
    <Box
      sx={{
        width: width ?? '100%',
        borderRadius: 2,
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
