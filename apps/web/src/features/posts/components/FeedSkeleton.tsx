import { Stack, PostSkeleton } from '@cattos/ui'

export const FeedSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <Stack spacing={2} p={2}>
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </Stack>
  )
}
