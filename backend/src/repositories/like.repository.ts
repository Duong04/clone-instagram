import { Prisma, ContentType } from '~/generated/prisma/client'
import { prisma } from '~/config/database'

type TX = Prisma.TransactionClient

class LikeRepository {
  async getLikedTargetIds(userId: string, targetIds: string[]): Promise<string[]> {
    const likes: Array<{ target_id: string }> = await prisma.like.findMany({
      where: { user_id: userId, target_id: { in: targetIds } },
      select: { target_id: true }
    })
    return likes.map((l) => l.target_id)
  }
  async createLike(tx: TX, userId: string, targetId: string, targetType: ContentType) {
    const existing = await tx.like.findUnique({
      where: {
        user_id_target_type_target_id: { user_id: userId, target_type: targetType, target_id: targetId }
      }
    })

    if (existing) return null

    return tx.like.create({
      data: { user_id: userId, target_id: targetId, target_type: targetType }
    })
  }

  async deleteLike(tx: TX, userId: string, targetId: string, targetType: ContentType) {
    return tx.like.deleteMany({
      where: { user_id: userId, target_id: targetId, target_type: targetType }
    })
  }

  async countLikes(tx: TX, targetId: string, targetType: ContentType) {
    return tx.like.count({ where: { target_id: targetId, target_type: targetType } })
  }

  async updateLikeCount(tx: TX, targetId: string, targetType: ContentType, offset: number) {
    const data = { like_count: { increment: offset } }

    if (targetType === ContentType.post) {
      return tx.post.update({ where: { id: targetId }, data })
    }
    if (targetType === ContentType.reel) {
      return tx.reel.update({ where: { id: targetId }, data })
    }
  }
}

export default new LikeRepository()
