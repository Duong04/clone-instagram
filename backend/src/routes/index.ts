import { Router } from 'express'
import authRoutes from './auth.route'
import mediaRoutes from './media.route'
import potsRoutes from './post.route'
import feedRoutes from './feed.route'
import commentRouters from './comment.route'
import profileRouters from './profile.route'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', profileRouters)
router.use('/media', mediaRoutes)
router.use('/posts', potsRoutes)
router.use('/feeds', feedRoutes)
router.use('/comments', commentRouters)

export default router
