import { Navigate } from 'react-router-dom'
import { RegisterScreen } from '@/features/auth/screens/RegisterScreen'
import { useAuthIsLoading, useAuthUser } from '@/stores/authStore'

export const RegisterPage = () => {
  const isLoading = useAuthIsLoading()
  const user = useAuthUser()
  const isAuthenticated = Boolean(user)

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <>
      <RegisterScreen />
    </>
  )
}
