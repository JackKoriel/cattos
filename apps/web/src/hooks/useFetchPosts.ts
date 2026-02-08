import { useState, useEffect, useCallback } from 'react'
import { Post } from '@cattos/shared'
import { apiClient, handleApiError } from '@/services/client'
import { useAuthIsLoading } from '@/stores/authStore'

const POSTS_PER_PAGE = 10

interface PostsQueryParams {
  limit: number
  skip: number
  authorId?: string
}

export const useFetchPosts = (authorId?: string) => {
  const authLoading = useAuthIsLoading()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const fetchPosts = useCallback(
    async (pageNum: number, isLoadMore = false) => {
      if (isLoadMore) setLoadingMore(true)
      else setLoading(true)

      try {
        const skip = (pageNum - 1) * POSTS_PER_PAGE
        const params: PostsQueryParams = { limit: POSTS_PER_PAGE, skip }
        if (authorId) params.authorId = authorId

        const response = await apiClient.get('/posts', { params })
        const newPosts = response.data.data

        if (newPosts.length < POSTS_PER_PAGE) {
          setHasMore(false)
        }

        setPosts((prev) => (pageNum === 1 ? newPosts : [...prev, ...newPosts]))
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(typeof errorMessage === 'string' ? errorMessage : errorMessage.message)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [authorId]
  )

  useEffect(() => {
    if (authLoading) return

    setPage(1)
    setHasMore(true)
    setPosts([])
    fetchPosts(1)
  }, [fetchPosts, authorId, authLoading])

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage, true)
    }
  }

  const refresh = useCallback(() => {
    setPage(1)
    setHasMore(true)
    setPosts([])
    setError(null)
    fetchPosts(1)
  }, [fetchPosts])

  const updatePost = useCallback((postId: string, updater: (prev: Post) => Post) => {
    setPosts((prev) =>
      prev.map((p) => {
        // Direct match
        if (p.id === postId) return updater(p)

        // If this is a reshare of the target post, update the nested repostOf
        if (p.repostOf && p.repostOf.id === postId) {
          return {
            ...p,
            repostOf: updater(p.repostOf as Post) as typeof p.repostOf,
          }
        }

        return p
      })
    )
  }, [])

  const prependPost = useCallback((post: Post) => {
    setPosts((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === post.id)
      if (existingIndex === 0) return prev
      if (existingIndex > 0) {
        const next = [...prev]
        next.splice(existingIndex, 1)
        return [post, ...next]
      }
      return [post, ...prev]
    })
  }, [])

  return { posts, loading, loadingMore, error, hasMore, loadMore, refresh, updatePost, prependPost }
}
