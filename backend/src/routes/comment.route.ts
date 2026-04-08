import { Router } from 'express'
import commentController from '~/controllers/comment.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.get('/:id', commentController.find)
router.get('/:id/replies', commentController.findReplies)
router.post('/', commentController.create)
router.put('/:id', commentController.update)
router.delete('/:id', commentController.delete)

export default router
