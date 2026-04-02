import { create } from "zustand";
import { feedApi } from "./api/feedApi";

export interface FeedItem {
  id: string;
  feed_id: string;
  feed_type: "post" | "reel";
  score?: number;
  created_at?: Date;
  is_liked?: boolean;
  is_saved?: boolean;
  display_timestamp?: number;
  [key: string]: unknown;
}

interface FeedStore {
  feed: FeedItem[];            
  isLoading: boolean;
  hasMore: boolean;
  cursor: string | null;       
  loadMore: () => Promise<void>;
  reset: () => void;           
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  feed: [],
  isLoading: false,
  hasMore: true,
  cursor: null,

  loadMore: async () => {
    const { isLoading, hasMore, cursor } = get()
    if (isLoading || !hasMore) return  

    set({ isLoading: true });
    try {
      const res = await feedApi.getFeed(cursor ?? '', 10);
      set((state) => ({
        feed: [...state.feed, ...res.data], 
        cursor: res.meta.nextCursor,
        hasMore: res.meta.hasNextPage
      }));
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => set({ feed: [], cursor: null, hasMore: true, isLoading: false })
}));