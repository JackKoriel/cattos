import { useState, useEffect, useCallback } from 'react'
import { Post } from '@cattos/shared'
import { apiClient, handleApiError } from '@/api/client'

const POSTS_PER_PAGE = 10

export const useFetchPosts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const fetchPosts = useCallback(async (pageNum: number, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true)
    else setLoading(true)

    try {
      const skip = (pageNum - 1) * POSTS_PER_PAGE
      const response = await apiClient.get('/posts', {
        params: { limit: POSTS_PER_PAGE, skip },
      })
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
  }, [])

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage, true)
    }
  }

  return { posts, loading, loadingMore, error, hasMore, loadMore }
}
