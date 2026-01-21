import type { Request, Response, NextFunction } from 'express'

interface AppError extends Error {
  statusCode?: number
  code?: string
}

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Error]', err.message, err.stack)

  if (err.name === 'CastError') {
    res.status(400).json({ success: false, error: 'Invalid ID format' })
    return
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({ success: false, error: err.message })
    return
  }

  if (err.code === '11000') {
    res.status(409).json({ success: false, error: 'Duplicate entry' })
    return
  }

  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Internal server error' : err.message,
  })
}

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' })
}
