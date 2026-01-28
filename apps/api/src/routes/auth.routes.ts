import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { authController } from '../controllers/index.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

router.post('/register', authLimiter, authController.registerUser)
router.post('/login', authLimiter, authController.loginUser)
router.post('/refresh', authLimiter, authController.refreshSession)
router.get('/me', requireAuth, authController.getMe)
router.post('/logout', requireAuth, authController.logoutUser)

export default router
