import { Router } from 'express'
import healthRoutes from './health.routes.js'
import postRoutes from './post.routes.js'
import userRoutes from './user.routes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/posts', postRoutes)
router.use('/users', userRoutes)

export default router
