import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import type { ParsedQs } from 'qs'
import { Types } from 'mongoose'
import { authController } from '../auth.controller.js'
import { authService } from '../../services/auth.service.js'
import { userService } from '../../services/user.service.js'

vi.mock('../../services/auth.service.js')
vi.mock('../../services/user.service.js')

type FindByIdResult = Awaited<ReturnType<(typeof userService)['findById']>>

interface AuthenticatedRequest extends Partial<TestRequest> {
  user?: { id: string }
}

type TestRequest = Request<
  Record<string, string>,
  unknown,
  Record<string, unknown>,
  ParsedQs,
  Record<string, unknown>
>

type TestResponse = Response<unknown, Record<string, unknown>>

describe('Auth Controller', () => {
  let mockReq: AuthenticatedRequest
  let mockRes: Partial<Response>
  let mockNext: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockReq = {
      body: {},
      cookies: {},
    }

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      cookie: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis(),
    }

    mockNext = vi.fn()
    vi.clearAllMocks()
  })

  describe('getMe', () => {
    it('should return 401 when not authenticated', async () => {
      await authController.getMe(
        mockReq as TestRequest,
        mockRes as TestResponse,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(401)
    })

    it('should return current user when authenticated', async () => {
      mockReq.user = { id: 'u1' }

      vi.mocked(userService.findById).mockResolvedValue({
        _id: new Types.ObjectId(),
        username: 'cat',
      } as unknown as FindByIdResult)

      await authController.getMe(
        mockReq as TestRequest,
        mockRes as TestResponse,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { _id: 'u1', username: 'cat' },
      })
    })
  })

  describe('registerUser', () => {
    it('should return 400 when missing fields', async () => {
      mockReq.body = { email: 'a@b.com' }

      await authController.registerUser(
        mockReq as TestRequest,
        mockRes as TestResponse,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(400)
    })

    it('should set refresh cookie and return access token on success', async () => {
      mockReq.body = { email: 'a@b.com', username: 'cat', password: 'password123' }

      vi.mocked(authService.register).mockResolvedValue({
        ok: true,
        user: { id: 'u1', email: 'a@b.com', username: 'cat', displayName: 'cat' },
        accessToken: 'access',
        refreshToken: 'refresh',
      })

      await authController.registerUser(
        mockReq as TestRequest,
        mockRes as TestResponse,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(201)
      expect(mockRes.cookie).toHaveBeenCalled()
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            accessToken: 'access',
            user: expect.objectContaining({ id: 'u1' }),
          }),
        })
      )
    })
  })

  describe('loginUser', () => {
    it('should return 400 when missing fields', async () => {
      mockReq.body = { identifier: 'cat' }

      await authController.loginUser(
        mockReq as TestRequest,
        mockRes as TestResponse,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(400)
    })

    it('should set refresh cookie and return access token on success', async () => {
      mockReq.body = { identifier: 'cat', password: 'password123' }

      vi.mocked(authService.login).mockResolvedValue({
        ok: true,
        user: { id: 'u1', email: 'a@b.com', username: 'cat', displayName: 'cat' },
        accessToken: 'access',
        refreshToken: 'refresh',
      })

      await authController.loginUser(
        mockReq as TestRequest,
        mockRes as TestResponse,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.cookie).toHaveBeenCalled()
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ accessToken: 'access' }),
        })
      )
    })
  })

  describe('refreshSession', () => {
    it('should return 401 when no refresh token provided', async () => {
      mockReq.body = {}

      await authController.refreshSession(
        mockReq as TestRequest,
        mockRes as TestResponse,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(401)
    })

    it('should rotate refresh cookie and return new access token', async () => {
      mockReq.body = { refreshToken: 'refresh' }

      vi.mocked(authService.refresh).mockResolvedValue({
        ok: true,
        accessToken: 'access2',
        refreshToken: 'refresh2',
      })

      await authController.refreshSession(
        mockReq as TestRequest,
        mockRes as TestResponse,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.cookie).toHaveBeenCalled()
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ accessToken: 'access2' }),
        })
      )
    })
  })

  describe('logoutUser', () => {
    it('should clear refresh cookie and return success', async () => {
      mockReq.body = { refreshToken: 'refresh' }

      vi.mocked(authService.logout).mockResolvedValue({ ok: true })

      await authController.logoutUser(
        mockReq as TestRequest,
        mockRes as TestResponse,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.clearCookie).toHaveBeenCalled()
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, message: 'Logged out' })
    })
  })
})
