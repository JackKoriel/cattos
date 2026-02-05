import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Post } from '@cattos/shared'
import { handleApiError } from '@/services/client'
import { postsService } from '@/services/posts'

export const usePostById = (postId: string | undefined) => {
  const stableId = useMemo(() => postId ?? '', [postId])

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!stableId) return

    setLoading(true)
    setError(null)

    try {
      const nextPost = await postsService.getById(stableId)
      setPost(nextPost)
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
      setPost(null)
    } finally {
      setLoading(false)
    }
  }, [stableId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { postId: stableId, post, setPost, loading, error, refresh }
}
