import type { ReactNode } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { BackdropLoader } from '@cattos/ui'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
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
