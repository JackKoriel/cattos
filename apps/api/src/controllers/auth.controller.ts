import type { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service.js'
import { env } from '../config/env.js'
import { userService } from '../services/user.service.js'
import { getBody, getCookieString, getString } from '../utils/request.utils.js'

const getRefreshFromRequest = (req: Request): string | undefined => {
  const cookieName = env.REFRESH_TOKEN_COOKIE_NAME
  const cookieToken = cookieName ? getCookieString(req, cookieName) : undefined

  const body = getBody(req)
  const bodyToken = getString(body.refreshToken)

  return cookieToken ?? bodyToken
}

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    const user = await userService.findById(req.user.id)
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' })
      return
    }

    res.json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = getBody(req)
    const email = getString(body.email)
    const username = getString(body.username)
    const password = getString(body.password)
    const displayName = getString(body.displayName)

    if (!email || !username || !password) {
      res.status(400).json({ success: false, error: 'Email, username, and password are required' })
      return
    }

    if (password.length < 8) {
      res.status(400).json({ success: false, error: 'Password must be at least 8 characters' })
      return
    }

    const result = await authService.register({ email, username, password, displayName })
    if (!result.ok) {
      res.status(result.status).json({ success: false, error: result.error })
      return
    }

    res.cookie(
      env.REFRESH_TOKEN_COOKIE_NAME,
      result.refreshToken,
      authService.getRefreshCookieOptions()
    )

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
        ...(env.NODE_ENV !== 'production' ? { refreshToken: result.refreshToken } : {}),
      },
    })
  } catch (error) {
    next(error)
  }
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = getBody(req)
    const identifier = getString(body.identifier)
    const password = getString(body.password)

    if (!identifier || !password) {
      res.status(400).json({ success: false, error: 'Identifier and password are required' })
      return
    }

    const result = await authService.login({ identifier, password })
    if (!result.ok) {
      res.status(result.status).json({ success: false, error: result.error })
      return
    }

    res.cookie(
      env.REFRESH_TOKEN_COOKIE_NAME,
      result.refreshToken,
      authService.getRefreshCookieOptions()
    )

    res.json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
        ...(env.NODE_ENV !== 'production' ? { refreshToken: result.refreshToken } : {}),
      },
    })
  } catch (error) {
    next(error)
  }
}

const refreshSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = getRefreshFromRequest(req)
    if (!refreshToken) {
      res.status(401).json({ success: false, error: 'Invalid refresh token' })
      return
    }

    const result = await authService.refresh({ refreshToken })
    if (!result.ok) {
      res.status(result.status).json({ success: false, error: result.error })
      return
    }

    res.cookie(
      env.REFRESH_TOKEN_COOKIE_NAME,
      result.refreshToken,
      authService.getRefreshCookieOptions()
    )

    res.json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
        ...(env.NODE_ENV !== 'production' ? { refreshToken: result.refreshToken } : {}),
      },
    })
  } catch (error) {
    next(error)
  }
}

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = getRefreshFromRequest(req)
    if (!refreshToken) {
      res.status(401).json({ success: false, error: 'No active session to logout' })
      return
    }

    await authService.logout({ refreshToken })

    res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, authService.getRefreshCookieOptions())
    res.json({ success: true, message: 'Logged out' })
  } catch (error) {
    next(error)
  }
}

export const authController = {
  getMe,
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
}
