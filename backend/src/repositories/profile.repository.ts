import { prisma } from '~/config/database'
import { ContentType } from '~/generated/prisma/client'
import { ResolvedFeedItem, FeedResult } from '~/types/feed.type'
import { encodeCursor, decodeCursor, type DiscoveryCursor } from '~/utils/cursor'
import { resolveFeedContent, USER_SELECT } from './shared/feed-resolver'
import { PostWithRelations, ReelWithRelations } from './shared/feed-resolver'

type PostFeedItem = PostWithRelations & { feed_type: typeof ContentType.post }
type ReelFeedItem = ReelWithRelations & { feed_type: typeof ContentType.reel }
type ContentFeedItem = PostFeedItem | ReelFeedItem

type MergeAndPaginateParams = {
  posts: PostWithRelations[]
  reels: ReelWithRelations[]
  limit: number
  decoded: DiscoveryCursor | null
}

class ProfileRepository {
  async getUserContent(
    userId: string,
    type: 'all' | 'post' | 'reel' = 'all',
    limit: number = 12,
    cursor?: string
  ): Promise<FeedResult<ResolvedFeedItem>> {
    const decoded = cursor ? decodeCursor(cursor) : null

    const fetchPosts = type === 'all' || type === 'post'
    const fetchReels = type === 'all' || type === 'reel'

    const [posts, reels] = await Promise.all([
      fetchPosts
        ? prisma.post.findMany({
            where: { user_id: userId, deleted_at: null },
            include: { user: { select: USER_SELECT }, media: { include: { media: true } } },
            orderBy: { created_at: 'desc' },
            take: limit + 1,
            cursor: decoded?.postCursor ? { id: decoded.postCursor } : undefined,
            skip: decoded?.postCursor ? 1 : 0
          })
        : [],
      fetchReels
        ? prisma.reel.findMany({
            where: { user_id: userId, deleted_at: null },
            include: { user: { select: USER_SELECT }, media: true },
            orderBy: { created_at: 'desc' },
            take: limit + 1,
            cursor: decoded?.reelCursor ? { id: decoded.reelCursor } : undefined,
            skip: decoded?.reelCursor ? 1 : 0
          })
        : []
    ])

    return this.mergeAndPaginate({ posts, reels, limit, decoded })
  }

  async getUserSaved(
    userId: string,
    type: 'all' | 'post' | 'reel' = 'all',
    limit: number = 12,
    cursor?: string
  ): Promise<FeedResult<ResolvedFeedItem>> {
    const decoded = cursor ? decodeCursor(cursor) : null

    const fetchPosts = type === 'all' || type === 'post'
    const fetchReels = type === 'all' || type === 'reel'

    const [postSaves, reelSaves] = await Promise.all([
      fetchPosts
        ? prisma.save.findMany({
            where: { user_id: userId, target_type: ContentType.post },
            orderBy: { created_at: 'desc' },
            take: limit + 1,
            cursor: decoded?.postCursor ? { id: decoded.postCursor } : undefined,
            skip: decoded?.postCursor ? 1 : 0
          })
        : [],
      fetchReels
        ? prisma.save.findMany({
            where: { user_id: userId, target_type: ContentType.reel },
            orderBy: { created_at: 'desc' },
            take: limit + 1,
            cursor: decoded?.reelCursor ? { id: decoded.reelCursor } : undefined,
            skip: decoded?.reelCursor ? 1 : 0
          })
        : []
    ])

    const combined = [
      ...postSaves.map((s) => ({ ...s, target_type: ContentType.post })),
      ...reelSaves.map((s) => ({ ...s, target_type: ContentType.reel }))
    ]
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit + 1)

    const hasNextPage = combined.length > limit
    const pageItems = combined.slice(0, limit)

    const lastPost = [...pageItems].reverse().find((i) => i.target_type === ContentType.post)
    const lastReel = [...pageItems].reverse().find((i) => i.target_type === ContentType.reel)

    const nextCursor = hasNextPage
      ? encodeCursor({
          postCursor: lastPost?.id ?? decoded?.postCursor,
          reelCursor: lastReel?.id ?? decoded?.reelCursor,
          timestamp: pageItems.at(-1)!.created_at.toISOString()
        })
      : null

    const data = await resolveFeedContent(
      pageItems.map((s) => ({
        id: s.id,
        user_id: s.user_id,
        target_id: s.target_id,
        target_type: s.target_type,
        score: 0,
        created_at: s.created_at
      }))
    )

    return {
      data,
      meta: { nextCursor, hasNextPage, limit }
    }
  }

  private mergeAndPaginate({ posts, reels, limit, decoded }: MergeAndPaginateParams): FeedResult<ResolvedFeedItem> {
    const combined: ContentFeedItem[] = [
      ...posts.map((p): PostFeedItem => ({ ...p, feed_type: ContentType.post })),
      ...reels.map((r): ReelFeedItem => ({ ...r, feed_type: ContentType.reel }))
    ]
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit + 1)

    const hasNextPage = combined.length > limit
    const pageItems = combined.slice(0, limit)

    const lastPost = [...pageItems].reverse().find((i): i is PostFeedItem => i.feed_type === ContentType.post)
    const lastReel = [...pageItems].reverse().find((i): i is ReelFeedItem => i.feed_type === ContentType.reel)

    const nextCursor = hasNextPage
      ? encodeCursor({
          postCursor: lastPost?.id ?? decoded?.postCursor,
          reelCursor: lastReel?.id ?? decoded?.reelCursor,
          timestamp: pageItems.at(-1)!.created_at.toISOString()
        })
      : null

    return {
      data: pageItems.map(
        (p): ResolvedFeedItem => ({
          ...p,
          feed_id: p.id,
          feed_type: p.feed_type,
          score: 0,
          media: p.feed_type === ContentType.reel ? (p.media ? [{ media: p.media, position: 0 }] : []) : p.media
        })
      ),
      meta: { nextCursor, hasNextPage, limit }
    }
  }
}

export default new ProfileRepository()
