import { ResolvedFeedItem } from '~/types/feed.type'
import { prisma } from '~/config/database'
import { ContentType, Prisma } from '~/generated/prisma/client'

type FeedRow = Prisma.FeedGetPayload<Record<string, never>>

export const USER_SELECT = {
  id: true,
  username: true,
  name: true,
  avatar: { select: { url: true } }
} as const

export type ReelWithRelations = Prisma.ReelGetPayload<{
  include: {
    user: { select: typeof USER_SELECT }
    media: true
  }
}>

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    user: { select: typeof USER_SELECT }
    media: { include: { media: true } }
  }
}>

export async function resolveFeedContent(feedItems: FeedRow[]): Promise<ResolvedFeedItem[]> {
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
