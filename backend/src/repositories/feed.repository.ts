import { prisma } from '~/config/database'
import { ContentType } from '~/generated/prisma/client'
import { ResolvedFeedItem, FeedResult } from '~/types/feed.type'
import { encodeCursor, decodeCursor } from '~/utils/cursor'
import { resolveFeedContent } from './shared/feed-resolver'
import { USER_SELECT } from './shared/feed-resolver'

type HomeFeedCursor =
  | { source: 'feed'; feedCursor?: string }
  | { source: 'discovery'; cursor?: string }

function parseHomeFeedCursor(cursor?: string): HomeFeedCursor | null {
  if (!cursor) return null

  try {
    const decoded = decodeCursor(cursor)
    if (decoded.source === 'discovery') return { source: 'discovery', cursor }
    if (decoded.source === 'feed') return { source: 'feed', feedCursor: decoded.feedCursor }
  } catch {
    return { source: 'feed', feedCursor: cursor }
  }

  return { source: 'feed', feedCursor: cursor }
}

class FeedRepository {
  async getHomeFeed(userId: string, limit: number = 10, cursor?: string): Promise<FeedResult<ResolvedFeedItem>> {
    const parsedCursor = parseHomeFeedCursor(cursor)
    const viewedIds = await this.getViewedIds(userId)

    if (parsedCursor && parsedCursor.source === 'discovery') {
      return this.getDiscoveryFeed(viewedIds, limit, parsedCursor.cursor)
    }

    const feedItems = await prisma.feed.findMany({
      where: {
        user_id: userId,
        ...(parsedCursor ? {} : { target_id: { notIn: viewedIds } })
      },
      orderBy: [{ score: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      cursor: parsedCursor?.feedCursor ? { id: parsedCursor.feedCursor } : undefined,
      skip: parsedCursor?.feedCursor ? 1 : 0
    })

    if (feedItems.length === 0) {
      return this.getDiscoveryFeed(viewedIds, limit)
    }

    const hasNextPage = feedItems.length > limit
    const pageItems = feedItems.slice(0, limit)
    const nextCursor = hasNextPage
      ? encodeCursor({
          source: 'feed',
          feedCursor: pageItems[pageItems.length - 1].id,
          timestamp: pageItems[pageItems.length - 1].created_at.toISOString()
        })
      : encodeCursor({
          source: 'discovery',
          timestamp: new Date().toISOString()
        })

    return {
      data: await resolveFeedContent(pageItems),
      meta: { nextCursor, hasNextPage: true, limit }
    }
  }

  private async getViewedIds(userId: string): Promise<string[]> {
    const views: Array<{ target_id: string }> = await prisma.view.findMany({
      where: { user_id: userId },
      select: { target_id: true }
    })
    return views.map((v) => v.target_id)
  }

  private async getDiscoveryFeed(
    viewedIds: string[],
    limit: number,
    cursor?: string
  ): Promise<FeedResult<ResolvedFeedItem>> {
    const decoded = cursor ? decodeCursor(cursor) : null
    const shouldFilterViewed = !decoded?.postCursor && !decoded?.reelCursor

    const [posts, reels] = await Promise.all([
      prisma.post.findMany({
        where: { ...(shouldFilterViewed ? { id: { notIn: viewedIds } } : {}), deleted_at: null },
        include: { user: { select: USER_SELECT }, media: { include: { media: true } } },
        orderBy: { created_at: 'desc' },
        take: limit + 1,
        cursor: decoded?.postCursor ? { id: decoded.postCursor } : undefined,
        skip: decoded?.postCursor ? 1 : 0
      }),
      prisma.reel.findMany({
        where: { ...(shouldFilterViewed ? { id: { notIn: viewedIds } } : {}), deleted_at: null },
        include: { user: { select: USER_SELECT }, media: true },
        orderBy: { created_at: 'desc' },
        take: limit + 1,
        cursor: decoded?.reelCursor ? { id: decoded.reelCursor } : undefined,
        skip: decoded?.reelCursor ? 1 : 0
      })
    ])

    const combined = [
      ...posts.map((p) => ({ ...p, feed_type: ContentType.post })),
      ...reels.map((r) => ({ ...r, feed_type: ContentType.reel }))
    ]
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit + 1)

    const hasNextPage = combined.length > limit
    const pageItems = combined.slice(0, limit)

    const lastPost = [...pageItems].reverse().find((i) => i.feed_type === ContentType.post)
    const lastReel = [...pageItems].reverse().find((i) => i.feed_type === ContentType.reel)

    const nextCursor = hasNextPage
      ? encodeCursor({
          source: 'discovery',
          postCursor: lastPost?.id ?? decoded?.postCursor,
          reelCursor: lastReel?.id ?? decoded?.reelCursor,
          timestamp: pageItems.at(-1)!.created_at.toISOString()
        })
      : null

    return {
      data: pageItems.map((p) => ({
        ...p,
        feed_id: p.id,
        media: p.feed_type === ContentType.reel ? (p.media ? [{ media: p.media, position: 0 }] : []) : (p.media ?? [])
      })),
      meta: { nextCursor, hasNextPage, limit }
    }
  }

  async trackView(userId: string, targetId: string, targetType: ContentType) {
    return prisma.view.upsert({
      where: {
        user_id_target_type_target_id: { user_id: userId, target_type: targetType, target_id: targetId }
      },
      update: {},
      create: { user_id: userId, target_type: targetType, target_id: targetId }
    })
  }
}

export default new FeedRepository()
