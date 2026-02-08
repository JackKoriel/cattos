import type { Ad, ApiResponse } from '@cattos/shared'
import { apiClient } from './client'

export const adsService = {
  async getSidebarAds(): Promise<Ad[]> {
    const response = await apiClient.get<ApiResponse<Ad[]>>('/ads/sidebar')
    return response.data.data ?? []
  },

  async getPostAds(): Promise<Ad[]> {
    const response = await apiClient.get<ApiResponse<Ad[]>>('/ads/post')
    return response.data.data ?? []
  },
}
