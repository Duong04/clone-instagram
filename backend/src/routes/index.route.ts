import { Router } from 'express'
import authRoutes from './auth.route'
import mediaRoutes from './media.route'

const router = Router()

router.use('/auth', authRoutes)
router.use('/media', mediaRoutes)

export default router
