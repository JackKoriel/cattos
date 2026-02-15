import bcrypt from 'bcrypt'
import jwt, { type SignOptions } from 'jsonwebtoken'
import type { CookieOptions } from 'express'
import { OnboardingStatus } from '@cattos/shared'
import { env } from '../config/env.js'
import { RefreshToken, User } from '../models/index.js'
import type { Model } from 'mongoose'
import type { IUser } from '../interfaces/user.interface.js'
import { authUtils } from '../utils/auth.utils.js'

type PublicUser = {
  id: string
  email: string
  username: string
  displayName: string
  onboardingStatus: OnboardingStatus
  avatar?: string
  bio?: string
}

const toPublicUser = (user: {
  _id: unknown
  email: string
  username: string
  displayName: string
  onboardingStatus?: unknown
  avatar?: unknown
  bio?: unknown
}): PublicUser => {
  const onboardingStatus =
    user.onboardingStatus === OnboardingStatus.Complete
      ? OnboardingStatus.Complete
      : OnboardingStatus.InProgress

  return {
    id: String(user._id),
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    onboardingStatus,
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

const slugifyUsername = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24)

const generateUniqueUsername = async (email: string): Promise<string> => {
  const localPart = email.split('@')[0] ?? ''
  const slug = slugifyUsername(localPart)
  const base = slug.length >= 3 ? slug : 'cat'

  const candidates: string[] = [base]
  for (let i = 0; i < 12; i += 1) {
    const suffix = String(Math.floor(Math.random() * 10_000)).padStart(4, '0')
    candidates.push(`${base}_${suffix}`.slice(0, 30))
  }

  const uniqueCandidates = Array.from(new Set(candidates)).filter((c) => c.length >= 3)
  const existing = await User.find({ username: { $in: uniqueCandidates } }, { username: 1 }).lean()
  const taken = new Set(
    existing
      .map((doc) => (doc as { username?: unknown }).username)
      .filter((u): u is string => typeof u === 'string')
  )

  for (const candidate of uniqueCandidates) {
    if (!taken.has(candidate)) return candidate
  }

  return `cat_${Date.now().toString(36)}`.slice(0, 30)
}

const register = async (input: { email: string; password: string }) => {
  const email = input.email.toLowerCase().trim()

  const existingEmail = await User.findOne({ email }).lean()
  if (existingEmail) {
    return { ok: false as const, status: 409 as const, error: 'Email already in use' }
  }

  const username = await generateUniqueUsername(email)

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS)

  const user = await new User({
    email,
    username,
    onboardingStatus: OnboardingStatus.InProgress,
    displayName: username,
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

  // Update lastLoginAt atomically; fall back to save/updateOne if needed.
  const now = new Date()
  const UserModel = User as unknown as Model<IUser>
  try {
    await UserModel.findByIdAndUpdate(user._id, { $set: { lastLoginAt: now } }).exec()
  } catch (err) {
    if (typeof user.save === 'function') {
      user.lastLoginAt = now
      await user.save()
    } else if (typeof UserModel.updateOne === 'function') {
      await UserModel.updateOne({ _id: user._id }, { $set: { lastLoginAt: now } }).exec()
    }
    // swallow errors from model helpers in test/mocked environments
  }

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

  const user = await User.findById(tokenDoc.userId).lean().exec()
  if (!user) {
    return { ok: false as const, status: 401 as const, error: 'Invalid refresh token' }
  }

  const accessToken = issueAccessToken(String(tokenDoc.userId))

  const rotated = await createAndStoreRefreshToken(String(tokenDoc.userId))
  tokenDoc.revokedAt = new Date()
  tokenDoc.replacedByTokenHash = rotated.tokenHash
  await tokenDoc.save()

  return {
    ok: true as const,
    user: toPublicUser(user),
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
