import { Router } from 'express'
import authController from '~/controllers/auth.controller'
import profileController from '~/controllers/profile.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)
router.get('/me', authMiddleware, authController.profile)
router.patch('/me', profileController.updateMe)
router.get('/me/content', profileController.getMeContent)
router.get('/me/saved', profileController.getUserSaved)
router.get('/:userId/content', profileController.getProfileContent)

export default router
