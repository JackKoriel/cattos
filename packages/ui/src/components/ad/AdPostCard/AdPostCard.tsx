import type { Ad } from '@cattos/shared'
import { Box } from '../../box'
import { Card } from '../../card'
import { Typography } from '../../typography'
import { VideoPlayer } from '../../video'

import { AdPostCardSkeleton } from './AdPostCardSkeleton'

type AdPostCardProps = {
  ad?: Ad
  onClick?: (ad: Ad) => void
  loading?: boolean
}

export const AdPostCard = ({ ad, onClick, loading }: AdPostCardProps) => {
  if (loading || !ad) {
    return <AdPostCardSkeleton />
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
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
        <VideoPlayer src={ad.videoUrl} onClick={(e) => e.stopPropagation()} />
      </Box>
    </Card>
  )
}
