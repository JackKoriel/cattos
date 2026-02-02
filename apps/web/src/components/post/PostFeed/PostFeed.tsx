import { useRef, useCallback } from 'react'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { PostCard, PostSkeleton } from '@cattos/ui'
import { useFetchPosts } from '@/hooks/useFetchPosts'

export const PostFeed = () => {
  const { posts, loading, loadingMore, error, hasMore, loadMore } = useFetchPosts()
  const observer = useRef<IntersectionObserver | null>(null)

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, loadingMore, hasMore, loadMore]
  )

  if (loading && posts.length === 0) {
    return (
      <Stack spacing={2} p={2}>
        {[1, 2, 3, 4, 5].map((n) => (
          <PostSkeleton key={n} />
        ))}
      </Stack>
    )
  }

  if (!loading && !error && posts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No posts found. Be the first to post! 🐱
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={2} p={2} pb={4}>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {hasMore && <div ref={lastPostRef} style={{ height: 1 }} />}

      {loadingMore && (
        <Box
          sx={{
            position: 'sticky',
            bottom: 12,
            display: 'flex',
            justifyContent: 'center',
            py: 2,
            pointerEvents: 'none',
          }}
        >
          <CircularProgress size={22} thickness={5} sx={{ opacity: 0.85 }} />
        </Box>
      )}

      {!hasMore && posts.length > 0 && (
        <Typography variant="body2" color="text.secondary" align="center" py={2}>
          You've reached the end! 🐱
        </Typography>
      )}
    </Stack>
  )
}
