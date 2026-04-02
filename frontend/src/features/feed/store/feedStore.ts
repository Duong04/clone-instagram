import { create } from 'zustand'
import { feedApi } from '../api/feedApi'
import type { FeedItem } from '~/shared/types/feed'

interface FeedStore {
  feed: FeedItem[]
  isLoading: boolean
  hasMore: boolean
  cursor: string | null
  loadMore: () => Promise<void>
  reset: () => void
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  feed: [],
  isLoading: false,
  hasMore: true,
  cursor: null,

  loadMore: async () => {
    const { isLoading, hasMore, cursor } = get()
    if (isLoading || !hasMore) return

    set({ isLoading: true })
    try {
      const res = await feedApi.getFeed(10, cursor ?? undefined)
      set((state) => ({
        feed: [...state.feed, ...res.data],
        cursor: res.meta.nextCursor,
        hasMore: res.meta.hasNextPage
      }))
    } catch (error) {
      console.error('Failed to load feed:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  reset: () => set({ feed: [], cursor: null, hasMore: true, isLoading: false })
}))