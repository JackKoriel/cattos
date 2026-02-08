import { useState, useEffect, useCallback } from 'react'
import { Post } from '@cattos/shared'
import { apiClient, handleApiError } from '@/services/client'
import { useAuthIsLoading, useAuthToken } from '@/stores/authStore'

const COMMENTS_PER_PAGE = 10

interface CommentsQueryParams {
  limit: number
  skip: number
}

export const useFetchComments = (postId: string) => {
  const authLoading = useAuthIsLoading()
  const token = useAuthToken()
  const [comments, setComments] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const fetchComments = useCallback(
    async (pageNum: number, isLoadMore = false) => {
      if (!postId) return

      if (isLoadMore) setLoadingMore(true)
      else setLoading(true)

      try {
        const skip = (pageNum - 1) * COMMENTS_PER_PAGE
        const params: CommentsQueryParams = { limit: COMMENTS_PER_PAGE, skip }

        const response = await apiClient.get(`/posts/${postId}/replies`, { params })
        const newComments = response.data.data

        if (newComments.length < COMMENTS_PER_PAGE) {
          setHasMore(false)
        }

        setComments((prev) => (pageNum === 1 ? newComments : [...prev, ...newComments]))
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(typeof errorMessage === 'string' ? errorMessage : errorMessage.message)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [postId]
  )

  useEffect(() => {
    if (authLoading) return
    setPage(1)
    setHasMore(true)
    setComments([])
    fetchComments(1)
  }, [fetchComments, postId, authLoading, token])

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchComments(nextPage, true)
    }
  }

  const refresh = useCallback(() => {
    setPage(1)
    setHasMore(true)
    setComments([])
    setError(null)
    fetchComments(1)
  }, [fetchComments])

  const addComment = (comment: Post) => {
    setComments((prev) => [comment, ...prev])
  }

  return { comments, loading, loadingMore, error, hasMore, loadMore, refresh, addComment }
}
