import { useRef } from 'react'
import { HomeScreenPresentation } from './presentation'
import type { PostFeedHandle } from '@/features/posts/components'

export const HomeScreen = () => {
  const feedRef = useRef<PostFeedHandle>(null)

  return (
    <HomeScreenPresentation
      feedRef={feedRef}
      onPostCreated={() => {
        feedRef.current?.refresh()
      }}
    />
  )
}
