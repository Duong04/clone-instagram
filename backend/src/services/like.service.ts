import likeRepository from '~/repositories/like.repository'
import { ContentType } from '~/generated/prisma/enums'
import { prisma } from '~/config/database'

class LikeService {
  async likeFeedItem(userId: string, targetId: string, targetType: ContentType, isLiked: boolean) {
    await prisma.$transaction(async (tx) => {
      if (!isLiked) {
        const like = await likeRepository.createLike(tx, userId, targetId, targetType)
        if (like) {
          await likeRepository.updateLikeCount(tx, targetId, targetType, 1)
        }
      } else {
        const result = await likeRepository.deleteLike(tx, userId, targetId, targetType)
        if (result.count > 0) {
          await likeRepository.updateLikeCount(tx, targetId, targetType, -1) // -1
        }
      }
    })
  }
}

export default new LikeService()
