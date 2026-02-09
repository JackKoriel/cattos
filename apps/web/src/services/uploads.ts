import { apiClient } from './client'
import type { ApiResponse } from '@cattos/shared'

export type UploadedImage = {
  url: string
  publicId: string
  width?: number
  height?: number
  format?: string
}

export const uploadAvatar = async (file: File): Promise<UploadedImage> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<ApiResponse<UploadedImage>>('/uploads/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  if (!response.data.data) {
    throw new Error(response.data.error || 'Failed to upload avatar')
  }

  return response.data.data
}

export const uploadCover = async (file: File): Promise<UploadedImage> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<ApiResponse<UploadedImage>>('/uploads/cover', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  if (!response.data.data) {
    throw new Error(response.data.error || 'Failed to upload cover image')
  }

  return response.data.data
}

export const uploadPostMedia = async (files: File[]): Promise<UploadedImage[]> => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  const response = await apiClient.post<ApiResponse<UploadedImage[]>>(
    '/uploads/post-media',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  if (!response.data.data) {
    throw new Error(response.data.error || 'Failed to upload media')
  }

  return response.data.data
}
