import profileRepository from '~/repositories/profile.repository'
import likeRepository from '~/repositories/like.repository'
import saveRepository from '~/repositories/save.repository'
import { ResolvedFeedItem } from '~/types/feed.type'

class ProfileService {
  async getUserContent(
    currentUserId: string,
    targetUserId: string,
    type: 'all' | 'post' | 'reel' = 'all',
    limit: number = 12,
    cursor?: string
  ) {
    const result = await profileRepository.getUserContent(targetUserId, type, limit, cursor)

    if (result.data.length === 0) return result

    return {
      data: await this.enrichMetadata(currentUserId, result.data),
      meta: result.meta
    }
  }

  async getUserSaved(userId: string, type: 'all' | 'post' | 'reel' = 'all', limit: number = 12, cursor?: string) {
    const result = await profileRepository.getUserSaved(userId, type, limit, cursor)

    if (result.data.length === 0) return result

    return {
      data: await this.enrichMetadata(userId, result.data),
      meta: result.meta
    }
  }

  private async enrichMetadata(userId: string, items: ResolvedFeedItem[]) {
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
}

export default new ProfileService()
