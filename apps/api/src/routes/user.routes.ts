import { Router } from 'express'
import { userController } from '../controllers/index.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/search', userController.searchUsers)
router.get('/username/:username', userController.getUserByUsername)
router.get('/:id', userController.getUserById)
router.patch('/:id', requireAuth, userController.updateUser)

export default router
