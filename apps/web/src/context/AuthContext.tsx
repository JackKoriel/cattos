import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@cattos/shared'
import { apiClient, handleApiError } from '../api/client'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to fetch current user using refresh token
        await refreshSession()
      } catch (err) {
        // If refresh fails, we are not logged in
        setUser(null)
        setToken(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Set default header when token changes
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete apiClient.defaults.headers.common['Authorization']
    }
  }, [token])

  const refreshSession = async () => {
    // Backend should have a refresh endpoint that reads the cookie and returns a new access token
    const response = await apiClient.post<AuthResponse>('/auth/refresh')
    const { user, accessToken } = response.data.data
    setToken(accessToken)
    setUser(user as unknown as User)
    return accessToken
  }

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
      const { user, accessToken } = response.data.data
      setToken(accessToken)
      setUser(user as unknown as User)
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
      throw apiError
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', credentials)
      const { user, accessToken } = response.data.data
      setToken(accessToken)
      setUser(user as unknown as User)
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
      throw apiError
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await apiClient.post('/auth/logout')
      setUser(null)
      setToken(null)
    } catch (err) {
      console.error('Logout failed', err)
      // Force logout client-side anyway
      setUser(null)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
