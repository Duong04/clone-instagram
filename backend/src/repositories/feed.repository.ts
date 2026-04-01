import { prisma } from '~/config/database'
import { ContentType } from '~/generated/prisma/client'

class FeedRepository {
  private async getViewedIds(userId: string) {
    const views = await prisma.view.findMany({
      where: { user_id: userId },
      select: { target_id: true }
    })
    return views.map((v) => v.target_id)
  }

  async getHomeFeed(userId: string, limit: number = 10, cursor?: string) {
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
    const data = hasNextPage ? feedItems.slice(0, limit) : feedItems

    const nextCursor = hasNextPage ? data[data.length - 1].id : null

    const resolvedData = await this.resolveFeedContent(data)

    return {
      data: resolvedData,
      meta: {
        nextCursor,
        hasNextPage,
        limit
      }
    }
  }

  private async getDiscoveryFeed(viewedIds: string[], limit: number) {
    const posts = await prisma.post.findMany({
      where: { id: { notIn: viewedIds }, deleted_at: null },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: { select: { url: true } } } },
        media: { include: { media: true } },
        _count: { select: { comments: true } }
      },
      orderBy: { created_at: 'desc' },
      take: limit
    })

    const data = posts.map((p) => ({
      ...p,
      feed_type: ContentType.post,
      feed_id: p.id
    }))

    return {
      data,
      meta: {
        nextCursor: null,
        hasNextPage: false,
        limit
      }
    }
  }

  private async resolveFeedContent(feedItems: any[]) {
    const postIds = feedItems.filter((f) => f.target_type === ContentType.post).map((f) => f.target_id)
    const reelIds = feedItems.filter((f) => f.target_type === ContentType.reel).map((f) => f.target_id)

    const [posts, reels] = await Promise.all([
      prisma.post.findMany({
        where: { id: { in: postIds } },
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
          media: { include: { media: true } }
        }
      }),
      prisma.reel.findMany({
        where: { id: { in: reelIds } },
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
          media: true
        }
      })
    ])

    return feedItems
      .map((item) => {
        const content =
          item.target_type === ContentType.post
            ? posts.find((p) => p.id === item.target_id)
            : reels.find((r) => r.id === item.target_id)

        if (!content) return null

        return {
          ...content,
          feed_id: item.id,
          feed_type: item.target_type,
          score: item.score
        }
      })
      .filter(Boolean)
  }

  async trackView(userId: string, targetId: string, targetType: ContentType) {
    return await prisma.$transaction([
      prisma.view.upsert({
        where: {
          user_id_target_type_target_id: {
            user_id: userId,
            target_type: targetType,
            target_id: targetId
          }
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
