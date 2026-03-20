import { Router } from 'express'
import postController from '~/controllers/post.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const router = Router()

router.get('/', authMiddleware, postController.getAll)
router.get('/:id', authMiddleware, postController.getById)
router.post('/', authMiddleware, postController.create)
router.put('/:id', authMiddleware, postController.update)
router.delete('/:id', authMiddleware, postController.remove)

export default router
