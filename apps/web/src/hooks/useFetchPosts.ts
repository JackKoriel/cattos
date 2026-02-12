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
  const [usersById, setUsersById] = useState<Record<string, Post['author']>>({})
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

        setUsersById((prev) => {
          const next = { ...prev }
          newPosts.forEach((post: Post) => {
            if (post.author?.id) next[post.author.id] = post.author
            if (post.repostOf?.author?.id) {
              const ra = post.repostOf.author
              next[ra.id] = ra
            }
          })
          return next
        })

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

  const setUser = useCallback((user: Post['author']) => {
    if (!user?.id) return
    setUsersById((prev) => ({ ...prev, [user.id]: user }))
  }, [])

  const updatePost = useCallback((postId: string, updater: (prev: Post) => Post) => {
    setPosts((prev) =>
      prev.map((post) => {
        // Direct match
        if (post.id === postId) return updater(post)

        // If this is a reshare of the target post, update the nested repostOf
        if (post.repostOf && post.repostOf.id === postId) {
          return {
            ...post,
            repostOf: updater(post.repostOf),
          }
        }

        return post
      })
    )
  }, [])

  const prependPost = useCallback((post: Post) => {
    setPosts((prev) => {
      const existingIndex = prev.findIndex((post) => post.id === post.id)
      if (existingIndex === 0) return prev
      if (existingIndex > 0) {
        const next = [...prev]
        next.splice(existingIndex, 1)
        return [post, ...next]
      }
      return [post, ...prev]
    })
  }, [])

  const replaceTempPost = useCallback((tempId: string, serverPost: Post) => {
    setPosts((prev) => {
      // If serverPost already exists elsewhere, remove the temp entry
      const existingWithServerId = prev.findIndex((post) => post.id === serverPost.id)
      const tempIndex = prev.findIndex((post) => post.id === tempId)

      if (existingWithServerId !== -1 && tempIndex !== -1 && existingWithServerId !== tempIndex) {
        return prev.filter((post) => post.id !== tempId)
      }

      // Replace temp entry if present, otherwise keep posts unchanged and prepend serverPost
      if (tempIndex !== -1) {
        const next = [...prev]
        next[tempIndex] = serverPost
        return next
      }

      // If no temp found but server post exists, ensure it's present; otherwise prepend
      if (existingWithServerId !== -1) return prev
      return [serverPost, ...prev]
    })
  }, [])

  const refreshPost = useCallback(async (postId: string) => {
    try {
      const response = await apiClient.get(`/posts/${postId}`)
      const fetched: Post = response.data.data
      const fetchedAuthor = fetched.author
      if (fetchedAuthor && fetchedAuthor.id)
        setUsersById((prev) => ({ ...prev, [fetchedAuthor.id]: fetchedAuthor }))
      setPosts((prev) => {
        const idx = prev.findIndex((post) => post.id === postId)
        if (idx !== -1) {
          const next = [...prev]
          next[idx] = fetched
          return next
        }
        // If not present, prepend so user can see it immediately
        return [fetched, ...prev]
      })
    } catch (err) {
      console.warn('Failed to refresh post', postId, err)
    }
  }, [])

  const refreshUser = useCallback(async (userId: string) => {
    try {
      const response = await apiClient.get(`/users/${userId}`)
      const user = response.data.data
      if (user?.id) setUsersById((prev) => ({ ...prev, [user.id]: user }))
      setPosts((prev) =>
        prev.map((post) => {
          const nextPost = { ...post }
          if (nextPost.author?.id === userId) nextPost.author = user
          if (nextPost.repostOf?.author?.id === userId) {
            nextPost.repostOf = { ...nextPost.repostOf, author: user }
          }
          return nextPost
        })
      )
    } catch (err) {
      console.warn('Failed to refresh user', userId, err)
    }
  }, [])

  const removePost = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }, [])

  return {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    updatePost,
    prependPost,
    replaceTempPost,
    refreshPost,
    refreshUser,
    usersById,
    setUser,
    removePost,
  }
}
