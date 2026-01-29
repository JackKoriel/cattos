import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest'
import { errorHandler, notFoundHandler } from '../error.middleware.js'
import type { Request, Response, NextFunction } from 'express'

describe('Error Middleware', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: ReturnType<typeof vi.fn>
  let consoleErrorSpy: MockInstance

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockReq = {}
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    }
    mockNext = vi.fn()
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('errorHandler', () => {
    it('should handle CastError from invalid MongoDB ID', () => {
      const error = new Error('Invalid ID')
      error.name = 'CastError'

      errorHandler(
        error,
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid ID format',
      })
    })

    it('should handle ValidationError', () => {
      const error = new Error('Validation failed')
      error.name = 'ValidationError'

      errorHandler(
        error,
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation failed',
      })
    })

    it('should handle duplicate key error (11000)', () => {
      const error = Object.assign(new Error('Duplicate entry'), { code: '11000' }) as Error & {
        code: string
      }

      errorHandler(
        error,
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(409)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Duplicate entry',
      })
    })

    it('should return 500 for unknown errors', () => {
      const error = new Error('Something went wrong')

      errorHandler(
        error,
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      })
    })

    it('should use custom statusCode if provided', () => {
      const error = Object.assign(new Error('Unauthorized'), { statusCode: 401 }) as Error & {
        statusCode: number
      }

      errorHandler(
        error,
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(401)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Unauthorized',
      })
    })
  })

  describe('notFoundHandler', () => {
    it('should return 404 for undefined routes', () => {
      notFoundHandler(mockReq as Request, mockRes as Response)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Route not found',
      })
    })
  })
})
