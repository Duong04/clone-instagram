import { Request, Response, NextFunction } from 'express'
import profileService from '~/services/profile.service'
import { sendSuccess } from '~/utils/response'
import { profileContentQuerySchema } from '~/dto/profile/profile.dto'

class ProfileController {
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
