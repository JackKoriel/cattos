export interface LoginCredentials {
  identifier: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
}

import { OnboardingStatus } from './onboarding.types'

export interface AuthUser {
  id: string
  username: string
  email: string
  displayName?: string
  // TODO: This is a temporary workaround to ensure old client always has a valid onboardingStatus --- IGNORE ---
  onboardingStatus?: OnboardingStatus
  avatar?: string
}

export interface AuthResponseData {
  user: AuthUser
  accessToken: string
  refreshToken?: string
}

export interface AuthResponse {
  success: boolean
  data: AuthResponseData
}
