import { Router } from 'express'
import postController from '~/controllers/post.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const router = Router()

router.get('/', postController.index)
router.get('/:id', authMiddleware, postController.show)
router.post('/', authMiddleware, postController.store)
router.put('/:id', authMiddleware, postController.update)
router.delete('/:id', authMiddleware, postController.destroy)

export default router
