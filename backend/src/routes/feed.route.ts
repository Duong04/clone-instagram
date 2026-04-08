import { Router } from 'express'
import feedController from '~/controllers/feed.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'
import likeController from '~/controllers/like.controller'
import commentController from '~/controllers/comment.controller'

const router = Router()

router.use(authMiddleware)

router.get('/', feedController.getHomeFeed)
router.post('/like', likeController.likeFeedItem)
router.post('/seen', feedController.markAsSeen)
router.get('/:targetId/comments', commentController.allByFeed)

export default router
