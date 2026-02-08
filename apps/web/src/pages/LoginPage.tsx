import { Navigate } from 'react-router-dom'
import { OnboardingStatus } from '@cattos/shared'
import { LoginScreen } from '@/features/auth/screens/LoginScreen'
import { useAuthIsLoading, useAuthUser } from '@/stores/authStore'

export const LoginPage = () => {
  const isLoading = useAuthIsLoading()
  const user = useAuthUser()
  const isAuthenticated = Boolean(user)

  if (!isLoading && isAuthenticated) {
    const hasCompletedOnboarding = user?.onboardingStatus === OnboardingStatus.Complete
    return <Navigate to={hasCompletedOnboarding ? '/' : '/onboarding'} replace />
  }

  return (
    <>
      <LoginScreen />
    </>
  )
}
