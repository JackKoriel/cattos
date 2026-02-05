import type { ApiResponse, User } from '@cattos/shared'
import { apiClient } from './client'

export const usersService = {
  async getByUsername(username: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/username/${username}`)

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'User not found')
    }

    return response.data.data
  },

  async update(
    userId: string,
    payload: Partial<Pick<User, 'displayName' | 'location' | 'avatar' | 'bio'>>
  ): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(`/users/${userId}`, payload)

    if (!response.data.data) {
      throw new Error(response.data.error || 'Failed to update user')
    }

    return response.data.data
  },
}
