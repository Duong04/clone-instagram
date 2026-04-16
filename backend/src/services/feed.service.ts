import feedRepository from '~/repositories/feed.repository'
import likeRepository from '~/repositories/like.repository'
import saveRepository from '~/repositories/save.repository'
import { ContentType } from '~/generated/prisma/client'
import { ResolvedFeedItem } from '~/types/feed.type'

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

    const [likedTargetIds, savedTargetIds] = await Promise.all([
      likeRepository.getLikedTargetIds(userId, targetIds),
      saveRepository.getSavedTargetIds(userId, targetIds)
    ])

    const likedIds = new Set(likedTargetIds)
    const savedIds = new Set(savedTargetIds)

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
