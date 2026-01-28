import { Router } from 'express'
import { bookmarkController } from '../controllers/index.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router({ mergeParams: true })

router.post('/', requireAuth, bookmarkController.addBookmark)
router.delete('/', requireAuth, bookmarkController.removeBookmark)

export default router
