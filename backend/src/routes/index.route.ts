import { Router } from 'express'
import postRoutes from './post.route'
import authRoutes from './auth.route'

const router = Router()

router.use('/posts', postRoutes)
router.use('/auth', authRoutes)

export default router
