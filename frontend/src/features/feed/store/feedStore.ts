// store/feedStore.ts
import { create } from 'zustand'
import { feedApi } from '../api/feedApi'
import type { FeedItem } from '~/shared/types/feed'

interface FeedStore {
  feed: FeedItem[]
  isLoading: boolean
  hasMore: boolean
  cursor: string | null
  error: string | null
  loadMore: () => Promise<void>
  reset: () => void
}

const FEED_PAGE_SIZE = 1

export const useFeedStore = create<FeedStore>((set, get) => ({
  feed: [],
  isLoading: false,
  hasMore: true,
  cursor: null,
  error: null,

  loadMore: async () => {
    const { isLoading, hasMore, cursor } = get()
    if (isLoading || !hasMore) return

    set({ isLoading: true, error: null })

    try {
      const res = await feedApi.getFeed(FEED_PAGE_SIZE, cursor ?? undefined)

      set((state) => ({
        feed: [...state.feed, ...res.data],
        cursor: res.meta.nextCursor ?? null,
        hasMore: res.meta.hasNextPage,
      }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load feed'
      set({ error: message })
    } finally {
      set({ isLoading: false })
    }
  },

  reset: () =>
    set({
      feed: [],
      cursor: null,
      hasMore: true,
      isLoading: false,
      error: null,
    }),
}))