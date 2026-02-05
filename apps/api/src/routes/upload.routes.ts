import { Router } from 'express'
import { uploadController } from '../controllers/upload.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { avatarUpload, postMediaUpload } from '../middleware/upload.middleware.js'

const router = Router()

router.post('/avatar', requireAuth, avatarUpload.single('file'), uploadController.uploadAvatar)
router.post(
  '/post-media',
  requireAuth,
  postMediaUpload.array('files', 4),
  uploadController.uploadPostMedia
)

export default router
