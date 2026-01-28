import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

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
  } catch {
    res.status(401).json({ success: false, error: 'Unauthorized' })
  }
}
