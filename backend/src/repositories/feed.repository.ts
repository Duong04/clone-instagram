import { prisma } from '~/config/database'
import { ContentType, Prisma } from '~/generated/prisma/client'
import { ResolvedFeedItem, FeedResult } from '~/types/feed'

const USER_SELECT = {
  id: true,
  username: true,
  name: true,
  avatar: { select: { url: true } }
} as const

type FeedRow = Prisma.FeedGetPayload<Record<string, never>>

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    user: { select: typeof USER_SELECT }
    media: { include: { media: true } }
  }
}>

type ReelWithRelations = Prisma.ReelGetPayload<{
  include: {
    user: { select: typeof USER_SELECT }
    media: true
  }
}>

class FeedRepository {
  async getHomeFeed(userId: string, limit: number = 10, cursor?: string): Promise<FeedResult<ResolvedFeedItem>> {
    const viewedIds = await this.getViewedIds(userId)

    const feedItems = await prisma.feed.findMany({
      where: {
        user_id: userId,
        target_id: { notIn: viewedIds }
      },
      orderBy: [{ score: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0
    })

    if (feedItems.length === 0) {
      return this.getDiscoveryFeed(viewedIds, limit)
    }

    const hasNextPage = feedItems.length > limit
    const pageItems = feedItems.slice(0, limit)
    const nextCursor = hasNextPage ? pageItems[pageItems.length - 1].id : null

    return {
      data: await this.resolveFeedContent(pageItems),
      meta: { nextCursor, hasNextPage, limit }
    }
  }

  private async getViewedIds(userId: string): Promise<string[]> {
    const views = await prisma.view.findMany({
      where: { user_id: userId },
      select: { target_id: true }
    })
    return views.map((v) => v.target_id)
  }

  private async getDiscoveryFeed(viewedIds: string[], limit: number): Promise<FeedResult<ResolvedFeedItem>> {
    const posts = await prisma.post.findMany({
      where: { id: { notIn: viewedIds }, deleted_at: null },
      include: {
        user: { select: USER_SELECT },
        media: { include: { media: true } }
      },
      orderBy: { created_at: 'desc' },
      take: limit
    })

    return {
      data: posts.map((p) => ({
        ...p,
        feed_id: p.id,
        feed_type: ContentType.post
      })),
      meta: { nextCursor: null, hasNextPage: false, limit }
    }
  }

  private async resolveFeedContent(feedItems: FeedRow[]): Promise<ResolvedFeedItem[]> {
    const postIds = feedItems.filter((i) => i.target_type === ContentType.post).map((i) => i.target_id)
    const reelIds = feedItems.filter((i) => i.target_type === ContentType.reel).map((i) => i.target_id)

    const [posts, reels] = await Promise.all([
      prisma.post.findMany({
        where: { id: { in: postIds } },
        include: {
          user: { select: USER_SELECT },
          media: { include: { media: true } }
        }
      }),
      prisma.reel.findMany({
        where: { id: { in: reelIds } },
        include: {
          user: { select: USER_SELECT },
          media: true
        }
      })
    ])

    const postMap = new Map<string, PostWithRelations>(posts.map((p) => [p.id, p]))
    const reelMap = new Map<string, ReelWithRelations>(reels.map((r) => [r.id, r]))

    return feedItems.reduce<ResolvedFeedItem[]>((acc, item) => {
      const content: PostWithRelations | ReelWithRelations | undefined =
        item.target_type === ContentType.post ? postMap.get(item.target_id) : reelMap.get(item.target_id)

      if (!content) return acc

      acc.push({ ...content, feed_id: item.id, feed_type: item.target_type, score: item.score })
      return acc
    }, [])
  }

  async trackView(userId: string, targetId: string, targetType: ContentType) {
    return prisma.$transaction([
      prisma.view.upsert({
        where: {
          user_id_target_type_target_id: { user_id: userId, target_type: targetType, target_id: targetId }
        },
        update: {},
        create: { user_id: userId, target_type: targetType, target_id: targetId }
      }),
      prisma.feed.deleteMany({
        where: { user_id: userId, target_id: targetId }
      })
    ])
  }
}

export default new FeedRepository()
