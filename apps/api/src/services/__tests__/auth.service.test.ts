import { describe, it, expect, beforeEach, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  bcryptHash: vi.fn<[string, string | number], Promise<string>>(),
  bcryptCompare: vi.fn<[string, string], Promise<boolean>>(),
  jwtSign: vi.fn<unknown[], string>(),
  refreshTokenCreate: vi.fn<unknown[], unknown>(),
  generateRefreshToken: vi.fn<[], string>(),
  hashToken: vi.fn<[string], string>(),
}))

vi.mock('../../config/env.js', () => ({
  env: {
    NODE_ENV: 'test',
    PORT: 3000,
    CORS_ORIGIN: undefined,
    MONGODB_URI: undefined,
    JWT_ACCESS_SECRET: 'test-access-secret',
    ACCESS_TOKEN_EXPIRES_IN: '15m',
    REFRESH_TOKEN_EXPIRES_DAYS: 30,
    BCRYPT_ROUNDS: 12,
    REFRESH_TOKEN_COOKIE_NAME: 'refreshToken',
    COOKIE_SECURE: false,
    requireEnv: (key: string) => {
      throw new Error(`Missing required environment variable: ${key}`)
    },
  },
}))

vi.mock('bcrypt', () => ({
  default: {
    hash: mocks.bcryptHash,
    compare: mocks.bcryptCompare,
  },
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: mocks.jwtSign,
  },
}))

vi.mock('../../utils/auth.utils.js', () => ({
  authUtils: {
    generateRefreshToken: mocks.generateRefreshToken,
    hashToken: mocks.hashToken,
  },
}))

vi.mock('../../models/index.js', () => {
  const UserCtor = vi.fn()
  ;(UserCtor as unknown as { findOne: unknown }).findOne = vi.fn<unknown[], unknown>()
  ;(UserCtor as unknown as { find: unknown }).find = vi.fn<unknown[], unknown>()
  ;(UserCtor as unknown as { findById: unknown }).findById = vi.fn<unknown[], unknown>()

  const RefreshTokenModel = {
    create: mocks.refreshTokenCreate,
    findOne: vi.fn<unknown[], unknown>(),
  }

  return {
    User: UserCtor,
    RefreshToken: RefreshTokenModel,
  }
})

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, RefreshToken } from '../../models/index.js'
import { authService } from '../auth.service.js'

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should reject if email already exists', async () => {
      vi.mocked(User.findOne).mockReturnValue({
        lean: vi.fn().mockResolvedValue({ _id: 'u1' }),
      } as unknown as ReturnType<(typeof User)['findOne']>)

      const result = await authService.register({
        email: 'cat@example.com',
        password: 'pw',
      })

      expect(result).toEqual({ ok: false, status: 409, error: 'Email already in use' })
      expect(User.findOne).toHaveBeenCalledWith({ email: 'cat@example.com' })
    })

    it('should create user, issue tokens, and store refresh token', async () => {
      vi.mocked(User.findOne).mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      } as unknown as ReturnType<(typeof User)['findOne']>)

      vi.mocked(User.find).mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      } as unknown as ReturnType<(typeof User)['find']>)

      mocks.bcryptHash.mockResolvedValue('hashed-pw')

      const savedUser = {
        _id: 'user-id',
        toObject: () => ({
          _id: 'user-id',
          email: 'cat@example.com',
          username: 'cat',
          displayName: 'cat',
        }),
      }

      const save = vi.fn().mockResolvedValue(savedUser)
      vi.mocked(
        User as unknown as (input: unknown) => { save: () => Promise<unknown> }
      ).mockImplementation(() => ({ save }))

      mocks.jwtSign.mockReturnValue('access-token')

      mocks.generateRefreshToken.mockReturnValue('refresh-token')
      mocks.hashToken.mockReturnValue('refresh-hash')

      mocks.refreshTokenCreate.mockResolvedValue({ _id: 'rt-1' } as unknown)

      const result = await authService.register({
        email: 'CAT@EXAMPLE.COM',
        password: 'pw',
      })

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.accessToken).toBe('access-token')
        expect(result.refreshToken).toBe('refresh-token')
        expect(result.user).toEqual({
          id: 'user-id',
          email: 'cat@example.com',
          username: 'cat',
          displayName: 'cat',
          onboardingStatus: 'inProgress',
          avatar: undefined,
          bio: undefined,
        })
      }

      expect(bcrypt.hash).toHaveBeenCalledWith('pw', 12)
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: 'user-id' },
        'test-access-secret',
        expect.any(Object)
      )
      expect(RefreshToken.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-id',
          tokenHash: 'refresh-hash',
          expiresAt: expect.any(Date),
        })
      )
    })
  })

  describe('login', () => {
    it('should reject when user not found', async () => {
      vi.mocked(User.findOne).mockReturnValue({
        select: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(null),
        }),
      } as unknown as ReturnType<(typeof User)['findOne']>)

      const result = await authService.login({ identifier: 'cat', password: 'pw' })

      expect(result).toEqual({ ok: false, status: 401, error: 'Invalid credentials' })
    })

    it('should reject when password mismatch', async () => {
      const userDoc = {
        _id: 'user-id',
        passwordHash: 'hash',
        lastLoginAt: undefined as unknown,
        save: vi.fn().mockResolvedValue(undefined),
        toObject: () => ({
          _id: 'user-id',
          email: 'cat@example.com',
          username: 'cat',
          displayName: 'cat',
        }),
      }

      vi.mocked(User.findOne).mockReturnValue({
        select: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(userDoc),
        }),
      } as unknown as ReturnType<(typeof User)['findOne']>)

      mocks.bcryptCompare.mockResolvedValue(false)

      const result = await authService.login({ identifier: 'cat', password: 'pw' })

      expect(result).toEqual({ ok: false, status: 401, error: 'Invalid credentials' })
    })

    it('should issue tokens on successful login', async () => {
      const userDoc = {
        _id: 'user-id',
        passwordHash: 'hash',
        lastLoginAt: undefined as unknown,
        save: vi.fn().mockResolvedValue(undefined),
        toObject: () => ({
          _id: 'user-id',
          email: 'cat@example.com',
          username: 'cat',
          displayName: 'cat',
        }),
      }

      vi.mocked(User.findOne).mockReturnValue({
        select: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(userDoc),
        }),
      } as unknown as ReturnType<(typeof User)['findOne']>)

      mocks.bcryptCompare.mockResolvedValue(true)
      mocks.jwtSign.mockReturnValue('access-token')
      mocks.generateRefreshToken.mockReturnValue('refresh-token')
      mocks.hashToken.mockReturnValue('refresh-hash')
      mocks.refreshTokenCreate.mockResolvedValue({ _id: 'rt-1' } as unknown)

      const result = await authService.login({ identifier: 'cat', password: 'pw' })

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.accessToken).toBe('access-token')
        expect(result.refreshToken).toBe('refresh-token')
      }
      expect(userDoc.save).toHaveBeenCalled()
    })
  })

  describe('refresh', () => {
    it('should reject invalid refresh token', async () => {
      mocks.hashToken.mockReturnValue('hash')
      vi.mocked(RefreshToken.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as unknown as ReturnType<(typeof RefreshToken)['findOne']>)

      const result = await authService.refresh({ refreshToken: 'rt' })

      expect(result).toEqual({ ok: false, status: 401, error: 'Invalid refresh token' })
    })

    it('should rotate refresh token and revoke old', async () => {
      const tokenDoc = {
        userId: 'user-id',
        revokedAt: undefined as Date | undefined,
        expiresAt: new Date(Date.now() + 60_000),
        replacedByTokenHash: undefined as string | undefined,
        save: vi.fn().mockResolvedValue(undefined),
      }

      mocks.hashToken.mockReturnValue('hash')
      vi.mocked(RefreshToken.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(tokenDoc),
      } as unknown as ReturnType<(typeof RefreshToken)['findOne']>)

      mocks.jwtSign.mockReturnValue('access-token')
      mocks.generateRefreshToken.mockReturnValue('new-refresh')
      mocks.hashToken.mockReturnValueOnce('hash').mockReturnValueOnce('new-hash')

      mocks.refreshTokenCreate.mockResolvedValue({ _id: 'rt-2' } as unknown)

      vi.mocked(User.findById).mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue({
            _id: 'user-id',
            email: 'cat@example.com',
            username: 'cat',
            displayName: 'Cat',
          }),
        }),
      } as unknown as ReturnType<(typeof User)['findById']>)

      const result = await authService.refresh({ refreshToken: 'rt' })

      expect(result).toEqual({
        ok: true,
        user: {
          id: 'user-id',
          email: 'cat@example.com',
          username: 'cat',
          displayName: 'Cat',
          onboardingStatus: 'inProgress',
          avatar: undefined,
          bio: undefined,
        },
        accessToken: 'access-token',
        refreshToken: 'new-refresh',
      })
      expect(tokenDoc.revokedAt).toBeInstanceOf(Date)
      expect(tokenDoc.replacedByTokenHash).toBe('new-hash')
      expect(tokenDoc.save).toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    it('should revoke token if found and not revoked', async () => {
      const tokenDoc = {
        revokedAt: undefined as Date | undefined,
        save: vi.fn().mockResolvedValue(undefined),
      }

      mocks.hashToken.mockReturnValue('hash')
      vi.mocked(RefreshToken.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(tokenDoc),
      } as unknown as ReturnType<(typeof RefreshToken)['findOne']>)

      const result = await authService.logout({ refreshToken: 'rt' })

      expect(result).toEqual({ ok: true })
      expect(tokenDoc.revokedAt).toBeInstanceOf(Date)
      expect(tokenDoc.save).toHaveBeenCalled()
    })

    it('should succeed even if token not found', async () => {
      mocks.hashToken.mockReturnValue('hash')
      vi.mocked(RefreshToken.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as unknown as ReturnType<(typeof RefreshToken)['findOne']>)

      const result = await authService.logout({ refreshToken: 'rt' })

      expect(result).toEqual({ ok: true })
    })
  })

  describe('getRefreshCookieOptions', () => {
    it('should return httpOnly cookie options for /api/auth', () => {
      const opts = authService.getRefreshCookieOptions()
      expect(opts).toEqual({ httpOnly: true, secure: false, sameSite: 'lax', path: '/api/auth' })
    })
  })
})
