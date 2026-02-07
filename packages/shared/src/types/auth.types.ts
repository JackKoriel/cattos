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

export interface AuthUser {
  id: string
  username: string
  email: string
  displayName?: string
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
