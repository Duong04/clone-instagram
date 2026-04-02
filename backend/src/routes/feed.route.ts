import { Router } from 'express'
import feedController from '~/controllers/feed.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.get('/', feedController.getHomeFeed)
router.post('/seen', feedController.markAsSeen)

export default router
