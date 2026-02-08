import { create } from 'zustand'
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@cattos/shared'
import { OnboardingStatus } from '@cattos/shared'
import { apiClient, handleApiError } from '@/services/client'

type AuthState = {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

type AuthActions = {
  clearError: () => void
  setCurrentUser: (user: User | null) => void
  login: (credentials: LoginCredentials) => Promise<User>
  register: (credentials: RegisterCredentials) => Promise<User>
  refreshSession: () => Promise<string>
  logout: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

const applyTokenToClient = (nextToken: string | null) => {
  if (nextToken) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${nextToken}`
  } else {
    delete apiClient.defaults.headers.common['Authorization']
  }
}

const ensureOnboardingStatus = (user: User): User => {
  const raw = (user as unknown as { onboardingStatus?: unknown }).onboardingStatus
  const onboardingStatus: OnboardingStatus =
    raw === OnboardingStatus.Complete ? OnboardingStatus.Complete : OnboardingStatus.InProgress
  return { ...user, onboardingStatus }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  error: null,

  clearError: () => set({ error: null }),

  setCurrentUser: (user) => {
    set({ user: user ? ensureOnboardingStatus(user) : null })
  },

  refreshSession: async () => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh')
    const { user, accessToken } = response.data.data
    applyTokenToClient(accessToken)
    set({ token: accessToken, user: ensureOnboardingStatus(user as unknown as User) })
    return accessToken
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
      const { user, accessToken } = response.data.data
      applyTokenToClient(accessToken)
      const nextUser = ensureOnboardingStatus(user as unknown as User)
      set({ token: accessToken, user: nextUser })
      return nextUser
    } catch (err) {
      const apiError = handleApiError(err)
      set({ error: apiError.message })
      throw apiError
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', credentials)
      const { user, accessToken } = response.data.data
      applyTokenToClient(accessToken)
      const nextUser = ensureOnboardingStatus(user as unknown as User)
      set({ token: accessToken, user: nextUser })
      return nextUser
    } catch (err) {
      const apiError = handleApiError(err)
      set({ error: apiError.message })
      throw apiError
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await apiClient.post('/auth/logout')
      set({ user: null, token: null })
      applyTokenToClient(null)
    } catch (err) {
      // Force logout client-side anyway
      set({ user: null, token: null })
      applyTokenToClient(null)
    } finally {
      set({ isLoading: false })
    }
  },
}))

// Convenience selectors (prefer these in components)
export const useAuthUser = () => useAuthStore((s) => s.user)
export const useAuthToken = () => useAuthStore((s) => s.token)
export const useAuthIsLoading = () => useAuthStore((s) => s.isLoading)
export const useAuthError = () => useAuthStore((s) => s.error)
export const useIsAuthenticated = () => useAuthStore((s) => Boolean(s.user))
export const useHasCompletedOnboarding = () =>
  useAuthStore((s) => s.user?.onboardingStatus === OnboardingStatus.Complete)

// Convenience action hooks
export const useAuthClearError = () => useAuthStore((s) => s.clearError)
export const useAuthSetCurrentUser = () => useAuthStore((s) => s.setCurrentUser)
export const useAuthLogin = () => useAuthStore((s) => s.login)
export const useAuthRegister = () => useAuthStore((s) => s.register)
export const useAuthRefreshSession = () => useAuthStore((s) => s.refreshSession)
export const useAuthLogout = () => useAuthStore((s) => s.logout)

export const initAuth = async () => {
  try {
    await useAuthStore.getState().refreshSession()
  } catch {
    useAuthStore.setState({ user: null, token: null })
    applyTokenToClient(null)
  } finally {
    useAuthStore.setState({ isLoading: false })
  }
}
