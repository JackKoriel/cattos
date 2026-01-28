import { Router } from 'express'
import { likeController } from '../controllers/index.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router({ mergeParams: true })

router.post('/', requireAuth, likeController.addLike)
router.delete('/', requireAuth, likeController.removeLike)
router.get('/', likeController.listLikesForPost)

export default router
