export interface MediaItem {
  id: string
  public_id: string
  url: string
  media_type: string
  width: number | null
  height: number | null
  duration: number | null
  created_at: string
}

export interface PostMedia {
  id: string
  post_id: string
  media_id: string
  position: number
  media: MediaItem
}

export interface FeedUser {
  id: string
  username: string
  name: string
  avatar: { url: string } | null
}

export interface FeedItem {
  id: string
  user_id: string
  caption: string | null
  location: string | null
  music_id: string | null
  like_count: number
  comment_count: number
  comments_disabled: boolean
  created_at: string
  deleted_at: string | null
  user: FeedUser
  media: PostMedia[]
  feed_id: string
  feed_type: 'post' | 'reel'
  score?: number
  is_liked: boolean
  is_saved: boolean
  display_timestamp: number
}

export interface FeedMeta {
  nextCursor: string | null
  hasNextPage: boolean
  limit: number
}

export interface FeedResponse {
  success: boolean
  message: string
  data: FeedItem[]
  meta: FeedMeta
}