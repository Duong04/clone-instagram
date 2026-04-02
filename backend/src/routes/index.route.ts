import { Router } from 'express'
import authRoutes from './auth.route'
import mediaRoutes from './media.route'
import potsRoutes from './post.route'
import feedRoutes from './feed.route'

const router = Router()

router.use('/auth', authRoutes)
router.use('/media', mediaRoutes)
router.use('/posts', potsRoutes)
router.use('/feeds', feedRoutes)

export default router
