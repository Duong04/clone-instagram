import { Router } from 'express'
import postController from '~/controllers/post.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.get('/', postController.getAll)
router.get('/:id', postController.getById)
router.post('/', postController.create)
router.put('/:id', postController.update)
router.delete('/:id', postController.remove)

export default router
