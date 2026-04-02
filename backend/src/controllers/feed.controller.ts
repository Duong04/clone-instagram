import { Request, Response, NextFunction } from 'express'
import feedService from '~/services/feed.service'
import { ContentType } from '~/generated/prisma/client'
import { sendError, sendSuccess } from '~/utils/response'

class FeedController {
  async getHomeFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id
      const limit = Number(req.query.limit) || 10
      const cursor = req.query.cursor as string | undefined

      const result = await feedService.getHomeFeed(userId, limit, cursor)

      sendSuccess({ res, data: result.data, meta: result.meta })
    } catch (error) {
      next(error)
    }
  }

  async markAsSeen(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id
      const { targetId, targetType } = req.body

      if (!targetId || !Object.values(ContentType).includes(targetType)) {
        return sendError({ res, message: 'Invalid targetId or targetType', statusCode: 400 })
      }

      await feedService.markAsSeen(userId, targetId, targetType as ContentType)

      sendSuccess({ res, message: 'Marked as seen' })
    } catch (error) {
      next(error)
    }
  }
}

export default new FeedController()
