import { Router } from 'express'
import { bookmarkController } from '../controllers/index.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', requireAuth, bookmarkController.listMyBookmarks)

export default router
