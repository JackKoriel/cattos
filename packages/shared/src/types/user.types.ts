import { OnboardingStatus } from './onboarding.types'

export interface User {
  id: string
  email: string
  username: string
  displayName: string
  onboardingStatus: OnboardingStatus
  avatar?: string
  coverImage?: string
  bio?: string
  location?: string
  website?: string
  createdAt: Date
}
