import { Router } from 'express'

import { uploadController } from '../controllers/upload.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { avatarUpload, postMediaUpload } from '../middleware/upload.middleware.js'

const router = Router()

router.post(
  '/avatar',
  requireAuth,
  avatarUpload.single('file'),
  (req, _res, next) => {
    req.params.type = 'avatar'
    next()
  },
  uploadController.uploadImage
)

router.post(
  '/cover',
  requireAuth,
  avatarUpload.single('file'),
  (req, _res, next) => {
    req.params.type = 'cover'
    next()
  },
  uploadController.uploadImage
)

router.post(
  '/post-media',
  requireAuth,
  postMediaUpload.array('files', 4),
  (req, _res, next) => {
    req.params.type = 'post'
    next()
  },
  uploadController.uploadImage
)

export default router
