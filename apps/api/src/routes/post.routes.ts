import { Router } from 'express'
import { postController } from '../controllers/index.js'

const router = Router()

router.get('/', postController.getAll)
router.get('/hashtag/:hashtag', postController.getByHashtag)
router.get('/:id', postController.getById)
router.get('/:id/replies', postController.getReplies)
router.post('/', postController.create)
router.patch('/:id', postController.update)
router.delete('/:id', postController.delete)

export default router
