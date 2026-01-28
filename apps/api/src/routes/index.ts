import { Router } from 'express'
import healthRoutes from './health.routes.js'
import postRoutes from './post.routes.js'
import userRoutes from './user.routes.js'
import authRoutes from './auth.routes.js'
import bookmarksRoutes from './bookmarks.routes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/posts', postRoutes)
router.use('/users', userRoutes)
router.use('/bookmarks', bookmarksRoutes)

export default router
