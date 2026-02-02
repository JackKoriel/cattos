import { createApiClient, handleApiError } from '@cattos/shared'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const apiClient = createApiClient(API_URL)

export { handleApiError }
