import type { Ad } from '@cattos/shared'
import { Box } from '../../box'
import { Card } from '../../card'
import { Typography } from '../../typography'
import { VideoPlayer } from '../../video'
import { useAppTheme } from '../../..'

import { AdPostCardSkeleton } from './AdPostCardSkeleton'

type AdPostCardProps = {
  ad?: Ad
  onClick?: (ad: Ad) => void
  loading?: boolean
}

export const AdPostCard = ({ ad, onClick, loading }: AdPostCardProps) => {
  const appTheme = useAppTheme()
  if (loading || !ad) {
    return <AdPostCardSkeleton />
  }

  return (
    <Card
      sx={{
        borderRadius: appTheme.radii.radix2,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick ? () => onClick(ad) : undefined}
    >
      <Box p={2} bgcolor="white">
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{
            cursor: 'pointer',
          }}
        >
          Ads tailored for you
        </Typography>
      </Box>

      <Box p={2} pt={0} bgcolor="white">
        <VideoPlayer src={ad.videoUrl} onClick={(e) => e.stopPropagation()} width="75%" />
      </Box>
    </Card>
  )
}
