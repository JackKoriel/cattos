export type AdPlacement = 'sidebar' | 'post'

export type Ad = {
  id: string
  placement: AdPlacement
  videoUrl: string
  linkPath: string
}
