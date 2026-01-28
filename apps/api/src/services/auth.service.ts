import bcrypt from 'bcrypt'
import jwt, { type SignOptions } from 'jsonwebtoken'
import type { CookieOptions } from 'express'
import { env } from '../config/env.js'
import { RefreshToken, User } from '../models/index.js'
import { authUtils } from '../utils/auth.utils.js'

type PublicUser = {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
}

const toPublicUser = (user: {
  _id: unknown
  email: string
  username: string
  displayName: string
  avatar?: unknown
  bio?: unknown
}): PublicUser => {
  return {
    id: String(user._id),
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatar: typeof user.avatar === 'string' ? user.avatar : undefined,
    bio: typeof user.bio === 'string' ? user.bio : undefined,
  }
}

const getRefreshCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax',
    path: '/api/auth',
  }
}

const issueAccessToken = (userId: string): string => {
  const secret = env.JWT_ACCESS_SECRET ?? env.requireEnv('JWT_ACCESS_SECRET')

  const rawExpiresIn = env.ACCESS_TOKEN_EXPIRES_IN
  const expiresIn: SignOptions['expiresIn'] = /^\d+$/.test(rawExpiresIn)
    ? Number(rawExpiresIn)
    : (rawExpiresIn as SignOptions['expiresIn'])

  return jwt.sign({ sub: userId }, secret, { expiresIn })
}

const createAndStoreRefreshToken = async (userId: string) => {
  const refreshToken = authUtils.generateRefreshToken()
  const tokenHash = authUtils.hashToken(refreshToken)

  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000)
  await RefreshToken.create({ userId, tokenHash, expiresAt })

  return { refreshToken, tokenHash, expiresAt }
}

const register = async (input: { email: string; username: string; password: string; displayName?: string }) => {
  const email = input.email.toLowerCase().trim()
  const username = input.username.trim()

  const existingEmail = await User.findOne({ email }).lean()
  if (existingEmail) {
    return { ok: false as const, status: 409 as const, error: 'Email already in use' }
  }

  const existingUsername = await User.findOne({ username }).lean()
  if (existingUsername) {
    return { ok: false as const, status: 409 as const, error: 'Username already taken' }
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS)

  const user = await new User({
    email,
    username,
    displayName: input.displayName?.trim() || username,
    passwordHash,
  }).save()

  const accessToken = issueAccessToken(String(user._id))
  const refresh = await createAndStoreRefreshToken(String(user._id))

  return {
    ok: true as const,
    user: toPublicUser(user.toObject()),
    accessToken,
    refreshToken: refresh.refreshToken,
  }
}

const login = async (input: { identifier: string; password: string }) => {
  const identifier = input.identifier.trim()
  const isEmail = identifier.includes('@')

  const user = await User.findOne(
    isEmail ? { email: identifier.toLowerCase() } : { username: identifier },
    undefined,
    { strictQuery: true }
  )
    .select('+passwordHash')
    .exec()

  if (!user || !user.passwordHash) {
    return { ok: false as const, status: 401 as const, error: 'Invalid credentials' }
  }

  const passwordOk = await bcrypt.compare(input.password, user.passwordHash)
  if (!passwordOk) {
    return { ok: false as const, status: 401 as const, error: 'Invalid credentials' }
  }

  user.lastLoginAt = new Date()
  await user.save()

  const accessToken = issueAccessToken(String(user._id))
  const refresh = await createAndStoreRefreshToken(String(user._id))

  return {
    ok: true as const,
    user: toPublicUser(user.toObject()),
    accessToken,
    refreshToken: refresh.refreshToken,
  }
}

const refresh = async (input: { refreshToken: string }) => {
  const tokenHash = authUtils.hashToken(input.refreshToken)

  const tokenDoc = await RefreshToken.findOne({ tokenHash }).exec()
  if (!tokenDoc) {
    return { ok: false as const, status: 401 as const, error: 'Invalid refresh token' }
  }

  if (tokenDoc.revokedAt) {
    return { ok: false as const, status: 401 as const, error: 'Invalid refresh token' }
  }

  if (tokenDoc.expiresAt.getTime() <= Date.now()) {
    return { ok: false as const, status: 401 as const, error: 'Refresh token expired' }
  }

  const accessToken = issueAccessToken(String(tokenDoc.userId))

  const rotated = await createAndStoreRefreshToken(String(tokenDoc.userId))
  tokenDoc.revokedAt = new Date()
  tokenDoc.replacedByTokenHash = rotated.tokenHash
  await tokenDoc.save()

  return {
    ok: true as const,
    accessToken,
    refreshToken: rotated.refreshToken,
  }
}

const logout = async (input: { refreshToken: string }) => {
  const tokenHash = authUtils.hashToken(input.refreshToken)
  const tokenDoc = await RefreshToken.findOne({ tokenHash }).exec()
  if (tokenDoc && !tokenDoc.revokedAt) {
    tokenDoc.revokedAt = new Date()
    await tokenDoc.save()
  }
  return { ok: true as const }
}

export const authService = {
  register,
  login,
  refresh,
  logout,
  getRefreshCookieOptions,
}
