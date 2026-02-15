import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'

export type AuthenticatedRequest = Request & {
  user?: {
    id: string
  }
}

type JwtPayload = {
  sub?: string
}

const getBearerToken = (req: Request): string | undefined => {
  const header = req.headers.authorization
  if (!header) return undefined

  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) return undefined
  return token
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getBearerToken(req)
    if (!token) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    const secret = env.JWT_ACCESS_SECRET ?? env.requireEnv('JWT_ACCESS_SECRET')
    const decoded = jwt.verify(token, secret) as JwtPayload

    if (!decoded.sub) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    req.user = { id: decoded.sub }
    next()
  } catch (err) {
    logger.warn('Auth verification failed', err)
    res.status(401).json({ success: false, error: 'Unauthorized' })
  }
}

export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = getBearerToken(req)
    if (!token) {
      next()
      return
    }

    const secret = env.JWT_ACCESS_SECRET ?? env.requireEnv('JWT_ACCESS_SECRET')
    const decoded = jwt.verify(token, secret) as JwtPayload
    if (decoded.sub) {
      req.user = { id: decoded.sub }
    }
  } catch (err) {
    logger.warn('Optional auth failed, proceeding without user info', err)
  }

  next()
}
