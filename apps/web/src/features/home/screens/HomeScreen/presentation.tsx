import { Box } from '@cattos/ui'
import type { ForwardedRef } from 'react'
import { CreatePost, PostFeed, type PostFeedHandle } from '@/features/posts/components'

export const HomeScreenPresentation = ({
  feedRef,
  onPostCreated,
}: {
  feedRef: ForwardedRef<PostFeedHandle>
  onPostCreated: () => void
}) => {
  return (
    <Box p={2}>
      <CreatePost onPostCreated={onPostCreated} />
      <Box mt={2}>
        <PostFeed ref={feedRef} showAds />
      </Box>
    </Box>
  )
}
