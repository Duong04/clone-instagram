import { Request, Response, NextFunction } from 'express'
import likeService from '~/services/like.service'
import { likeFeedItemSchema } from '~/dto/feed/like.dto'

class LikeController {
  async likeFeedItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetId, targetType, isLiked } = likeFeedItemSchema.parse(req.body)
      const userId = req.user!.id

      await likeService.likeFeedItem(userId, targetId, targetType, isLiked)

      res.status(200).json({ message: 'Like status updated successfully' })
    } catch (error) {
      next(error)
    }
  }
}

export default new LikeController()
