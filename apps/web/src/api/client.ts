import { createApiClient, handleApiError } from '@cattos/shared'

// In dev, force same-origin (via Vite proxy) so auth cookies survive hard reload.
// In non-dev environments, allow configuring the API URL.
const API_URL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL || '/api'

export const apiClient = createApiClient(API_URL)

export { handleApiError }
