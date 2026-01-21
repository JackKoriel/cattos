import { Router } from 'express'
import { userController } from '../controllers/index.js'

const router = Router()

router.get('/', userController.getAll)
router.get('/search', userController.search)
router.get('/username/:username', userController.getByUsername)
router.get('/:id', userController.getById)
router.post('/', userController.create)
router.patch('/:id', userController.update)

export default router
