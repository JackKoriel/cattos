import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { authController } from '../controllers/index.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { env } from '../config/env.js'

const router = Router()

const windowMs = 15 * 60 * 1000 // 15 minutes
const isProd = env.NODE_ENV === 'production'

const createLimiter = (limits: { prod: number; dev: number }) =>
  rateLimit({
    windowMs,
    limit: isProd ? limits.prod : limits.dev,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })

const loginLimiter = createLimiter({ prod: 20, dev: 200 })
const registerLimiter = createLimiter({ prod: 20, dev: 200 })
const refreshLimiter = createLimiter({ prod: 200, dev: 2000 })

router.post('/register', registerLimiter, authController.registerUser)
router.post('/login', loginLimiter, authController.loginUser)
router.post('/refresh', refreshLimiter, authController.refreshSession)
router.get('/me', requireAuth, authController.getMe)
router.get('/username-available', requireAuth, authController.checkUsernameAvailable)
router.patch('/onboarding', requireAuth, authController.completeOnboarding)
router.post('/logout', requireAuth, authController.logoutUser)

export default router
