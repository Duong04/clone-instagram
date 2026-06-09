import { Request, Response, NextFunction } from 'express'
import profileService from '~/services/profile.service'
import { sendSuccess } from '~/utils/response'
import { profileContentQuerySchema, updateProfileBodySchema } from '~/dto/profile/profile.dto'

class ProfileController {
  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id
      const body = updateProfileBodySchema.parse(req.body)
      const result = await profileService.updateMe(userId, body)

      sendSuccess({ res, data: result, message: 'Profile updated successfully' })
    } catch (error) {
      next(error)
    }
  }

  async getMeContent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id
      const { limit, cursor, type } = profileContentQuerySchema.parse(req.query)

      const result = await profileService.getUserContent(userId, userId, type, limit, cursor)

      sendSuccess({ res, data: result.data, meta: result.meta })
    } catch (error) {
      next(error)
    }
  }

  async getProfileContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, cursor, type } = profileContentQuerySchema.parse(req.query)
      const targetUserId = req.params.userId as string
      const currentUserId = req.user!.id

      const result = await profileService.getUserContent(currentUserId, targetUserId, type, limit, cursor)
      sendSuccess({ res, data: result.data, meta: result.meta })
    } catch (error) {
      next(error)
    }
  }

  async getUserSaved(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id
      const { limit, cursor, type } = profileContentQuerySchema.parse(req.query)

      const result = await profileService.getUserSaved(userId, type, limit, cursor)

      sendSuccess({ res, data: result.data, meta: result.meta })
    } catch (error) {
      next(error)
    }
  }
}

export default new ProfileController()
