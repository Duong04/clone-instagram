import feedRepository from '~/repositories/feed.repository'
import { ContentType } from '~/generated/prisma/client'
import { prisma } from '~/config/database'
import { ResolvedFeedItem } from '~/types/feed'

class FeedService {
  async getHomeFeed(userId: string, limit: number = 10, cursor?: string) {
    const result = await feedRepository.getHomeFeed(userId, limit, cursor)

    if (result.data.length === 0) return result

    return {
      data: await this.enrichFeedMetadata(userId, result.data),
      meta: result.meta
    }
  }

  private async enrichFeedMetadata(userId: string, items: ResolvedFeedItem[]) {
    const targetIds = items.map((i) => i.id)

    // ✅ Parallel fetch
    const [userLikes, userSaves] = await Promise.all([
      prisma.like.findMany({
        where: { user_id: userId, target_id: { in: targetIds } },
        select: { target_id: true }
      }),
      prisma.save.findMany({
        where: { user_id: userId, target_id: { in: targetIds } },
        select: { target_id: true }
      })
    ])

    const likedIds = new Set(userLikes.map((l) => l.target_id))
    const savedIds = new Set(userSaves.map((s) => s.target_id))

    return items.map((item) => ({
      ...item,
      is_liked: likedIds.has(item.id as string),
      is_saved: savedIds.has(item.id as string),
      display_timestamp: (item.created_at as Date)?.getTime() ?? Date.now()
    }))
  }

  async markAsSeen(userId: string, targetId: string, targetType: ContentType) {
    return feedRepository.trackView(userId, targetId, targetType)
  }
}

export default new FeedService()
