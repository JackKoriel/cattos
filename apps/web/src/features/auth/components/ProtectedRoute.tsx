import type { ReactNode } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { BackdropLoader } from '@cattos/ui'
import { useAuthIsLoading, useIsAuthenticated } from '@/stores/authStore'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isLoading = useAuthIsLoading()
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  if (isLoading) {
    return <BackdropLoader open={true} />
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
