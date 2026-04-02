import { ContentType } from '~/generated/prisma/client'

export interface FeedMeta {
  nextCursor: string | null
  hasNextPage: boolean
  limit: number
}

export interface FeedResult<T> {
  data: T[]
  meta: FeedMeta
}

export interface ResolvedFeedItem {
  id: string
  feed_id: string
  feed_type: ContentType
  score?: number
  created_at?: Date
  is_liked?: boolean
  is_saved?: boolean
  display_timestamp?: number
  [key: string]: unknown
}