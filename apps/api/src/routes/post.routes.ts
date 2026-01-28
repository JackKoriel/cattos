import { Router } from 'express'
import { postController } from '../controllers/index.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import likeRoutes from './like.routes.js'
import bookmarkRoutes from './bookmark.routes.js'

const router = Router()

router.get('/', postController.listPosts)
router.get('/hashtag/:hashtag', postController.listPostsByHashtag)
router.get('/:id', postController.getPostById)
router.get('/:id/replies', postController.listRepliesForPost)
router.post('/', requireAuth, postController.createPost)
router.patch('/:id', requireAuth, postController.updatePost)
router.delete('/:id', requireAuth, postController.deletePost)
router.use('/:postId/likes', likeRoutes)
router.use('/:postId/bookmarks', bookmarkRoutes)

export default router
