import { useState, useEffect } from 'react'
import { Post } from '@cattos/shared'
import { apiClient, handleApiError } from '@/api/client'

export const useFetchPosts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get('/posts')
        setPosts(response.data.data)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(typeof errorMessage === 'string' ? errorMessage : errorMessage.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return { posts, loading, error }
}
