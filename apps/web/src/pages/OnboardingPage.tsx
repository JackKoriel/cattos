import { Navigate } from 'react-router-dom'
import { OnboardingStatus } from '@cattos/shared'
import { OnboardingScreen } from '@/features/onboarding/screens/OnboardingScreen'
import { useAuthUser } from '@/stores/authStore'

export const OnboardingPage = () => {
  const user = useAuthUser()
  const hasCompletedOnboarding = user?.onboardingStatus === OnboardingStatus.Complete

  if (hasCompletedOnboarding) return <Navigate to="/" replace />

  return <OnboardingScreen />
}
