import { useEffect, useMemo, useState } from 'react'
import type { Ad } from '@cattos/shared'
import { Box } from '../../box'
import { IconButton } from '../../icon-button'
import { Stack } from '../../stack'
import { Typography } from '../../typography'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons'
import { VideoPlayer } from '../../video'

import { AdCarouselSkeleton } from './AdCarouselSkeleton'

export type AdCarouselProps = {
  ads: Ad[]
  title?: string
  loading?: boolean
}

export const AdCarousel = ({ ads, title = 'Ads', loading }: AdCarouselProps) => {
  const [index, setIndex] = useState(0)

  const safeAds = useMemo(() => ads ?? [], [ads])

  useEffect(() => {
    if (index >= safeAds.length) setIndex(0)
  }, [index, safeAds.length])

  if (loading) {
    return <AdCarouselSkeleton />
  }

  if (!safeAds.length) {
    return (
      <Box
        p={2}
        bgcolor="#f5f5f5"
        borderRadius={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h2" mb={1}>
          🐱
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center">
          No ads yet.
        </Typography>
      </Box>
    )
  }

  const current = safeAds[index]

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + safeAds.length) % safeAds.length)
  }

  const goNext = () => {
    setIndex((prev) => (prev + 1) % safeAds.length)
  }

  return (
    <Box>
      {title && (
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ cursor: 'default', userSelect: 'none' }}
        >
          {title}
        </Typography>
      )}

      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton aria-label="Previous ad" size="small" onClick={goPrev}>
          <ChevronLeftIcon />
        </IconButton>

        <Box flex={1}>
          <VideoPlayer key={current.videoUrl} src={current.videoUrl} height="317px" />
        </Box>

        <IconButton aria-label="Next ad" size="small" onClick={goNext}>
          <ChevronRightIcon />
        </IconButton>
      </Stack>
    </Box>
  )
}
