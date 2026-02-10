import { useRef } from 'react'
import { HomeScreenPresentation } from './presentation'
import type { PostFeedHandle } from '@/features/posts/components'

export const HomeScreen = () => {
  const feedRef = useRef<PostFeedHandle>(null)

  return (
    <HomeScreenPresentation
      feedRef={feedRef}
      onBeforeCreate={(tempPost) => {
        feedRef.current?.prependPost?.(tempPost)
      }}
      onPostCreated={(serverPost, tempId) => {
        feedRef.current?.replaceTempPost?.(tempId, serverPost)
      }}
      onPostFailed={(tempId) => {
        feedRef.current?.removePost?.(tempId)
      }}
    />
  )
}
