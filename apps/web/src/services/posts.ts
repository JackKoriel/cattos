import type { ApiResponse, Post } from '@cattos/shared'
import { apiClient } from './client'

type AxiosishError = {
  response?: {
    status?: number
  }
}

const isAxiosishError = (err: unknown): err is AxiosishError => {
  return typeof err === 'object' && err !== null && 'response' in err
}

const swallowIfAlreadyInDesiredState = (err: unknown) => {
  if (isAxiosishError(err)) {
    const status = err.response?.status
    if (status === 404 || status === 409) return
  }
  throw err
}

export const postsService = {
  async create(payload: {
    content: string
    visibility: 'public' | 'private'
    mediaUrls?: string[]
  }): Promise<void> {
    await apiClient.post('/posts', {
      content: payload.content,
      visibility: payload.visibility,
      mediaUrls: payload.mediaUrls ?? [],
    })
  },

  async getById(postId: string): Promise<Post> {
    const response = await apiClient.get<ApiResponse<Post>>(`/posts/${postId}`)

    if (!response.data.data) {
      throw new Error(response.data.error || 'Post not found')
    }

    return response.data.data
  },

  async like(postId: string): Promise<void> {
    try {
      await apiClient.post(`/posts/${postId}/likes`)
    } catch (err) {
      swallowIfAlreadyInDesiredState(err)
    }
  },

  async unlike(postId: string): Promise<void> {
    try {
      await apiClient.delete(`/posts/${postId}/likes`)
    } catch (err) {
      swallowIfAlreadyInDesiredState(err)
    }
  },

  async bookmark(postId: string): Promise<void> {
    try {
      await apiClient.post(`/posts/${postId}/bookmarks`)
    } catch (err) {
      swallowIfAlreadyInDesiredState(err)
    }
  },

  async unbookmark(postId: string): Promise<void> {
    try {
      await apiClient.delete(`/posts/${postId}/bookmarks`)
    } catch (err) {
      swallowIfAlreadyInDesiredState(err)
    }
  },

  async repost(postId: string): Promise<void> {
    await apiClient.post('/posts', {
      repostOfId: postId,
      content: '',
      visibility: 'public',
    })
  },

  shareUrl(postId: string): string {
    return `${window.location.origin}/post/${postId}`
  },
}
