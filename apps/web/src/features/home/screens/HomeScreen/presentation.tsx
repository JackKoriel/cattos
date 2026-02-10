import { Box } from '@cattos/ui'
import type { ForwardedRef } from 'react'
import { CreatePost, PostFeed, type PostFeedHandle } from '@/features/posts/components'
import type { Post } from '@cattos/shared'

export const HomeScreenPresentation = ({
  feedRef,
  onBeforeCreate,
  onPostCreated,
  onPostFailed,
}: {
  feedRef: ForwardedRef<PostFeedHandle>
  onBeforeCreate: (tempPost: Post) => void
  onPostCreated: (serverPost: Post, tempId: string) => void
  onPostFailed: (tempId: string) => void
}) => {
  return (
    <Box p={2}>
      <CreatePost
        onBeforeCreate={onBeforeCreate}
        onPostCreated={onPostCreated}
        onPostFailed={onPostFailed}
      />
      <Box mt={2}>
        <PostFeed ref={feedRef} showAds />
      </Box>
    </Box>
  )
}
