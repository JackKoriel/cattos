import { Router } from 'express'
import { adsController } from '../controllers/ad.controller.js'

const router = Router()

router.get('/sidebar', adsController.getSidebarAds)
router.get('/post', adsController.getPostAds)

export default router
