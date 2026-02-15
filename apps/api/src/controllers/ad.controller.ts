import type { NextFunction, Request, Response } from 'express'
import { cloudinary } from '../config/cloudinary.js'
import { logger } from '../utils/logger.js'

type AdPlacement = 'sidebar' | 'post'

type AdDto = {
  id: string
  placement: AdPlacement
  videoUrl: string
  linkPath: string
}

// 7 post ads and 3 sidebar ads
const MAX_ADS_PER_PLACEMENT = 10
const CACHE_TTL_MS = 5 * 60 * 1000

const folders = {
  sidebar: 'cattos/ads/sidebar',
  post: 'cattos/ads/post',
} as const

type CacheEntry = { expiresAt: number; ads: AdDto[] }
const cache: Partial<Record<AdPlacement, CacheEntry>> = {}

const mapResourcesToAds = (
  resources: Array<{ secure_url?: string; public_id?: string }>,
  placement: AdPlacement
): AdDto[] => {
  return resources
    .map((r) => {
      const videoUrl = r.secure_url
      if (!videoUrl) return null
      return {
        id: r.public_id ?? videoUrl,
        placement,
        videoUrl,
        linkPath: '/coming-soon',
      } satisfies AdDto
    })
    .filter((a): a is AdDto => !!a)
}

const fetchFolderVideos = async (folder: string) => {
  try {
    const searchResult = await cloudinary.search
      .expression(`folder:${folder} AND resource_type:video`)
      .sort_by('created_at', 'desc')
      .max_results(MAX_ADS_PER_PLACEMENT)
      .execute()

    const resources = (searchResult?.resources ?? []) as Array<{
      secure_url?: string
      public_id?: string
    }>

    if (resources.length > 0) return resources
  } catch (err) {
    logger.warn(`Cloudinary search failed for folder ${folder}, falling back to list API`, err)
  }

  const listResult = await cloudinary.api.resources({
    resource_type: 'video',
    type: 'upload',
    prefix: `${folder}/`,
    max_results: MAX_ADS_PER_PLACEMENT,
  })

  return (listResult?.resources ?? []) as Array<{ secure_url?: string; public_id?: string }>
}

const getCachedOrFetch = async (placement: AdPlacement): Promise<AdDto[]> => {
  const existing = cache[placement]
  if (existing && existing.expiresAt > Date.now()) return existing.ads

  const folder = placement === 'sidebar' ? folders.sidebar : folders.post
  const resources = await fetchFolderVideos(folder)
  const ads = mapResourcesToAds(resources.slice(0, MAX_ADS_PER_PLACEMENT), placement)

  cache[placement] = { ads, expiresAt: Date.now() + CACHE_TTL_MS }
  return ads
}

const getSidebarAds = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const ads = await getCachedOrFetch('sidebar')
    res.json({ success: true, data: ads, count: ads.length })
  } catch (error) {
    next(error)
  }
}

const getPostAds = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const ads = await getCachedOrFetch('post')
    res.json({ success: true, data: ads, count: ads.length })
  } catch (error) {
    next(error)
  }
}

export const adsController = {
  getSidebarAds,
  getPostAds,
}
