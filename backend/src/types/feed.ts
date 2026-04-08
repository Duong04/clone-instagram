import { ContentType } from '~/generated/prisma/client'
import { Meta } from '~/utils/response'

export interface FeedResult<T> {
  data: T[]
  meta: Meta
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
