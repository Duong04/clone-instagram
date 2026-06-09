import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profileApi } from "../api/profileApi";
import type { FeedItem } from "~/shared/types/feed";

type ProfileTab = "posts" | "saved" | "tagged";

type SliceState = {
  items: FeedItem[];
  cursor: string | null;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
};

const PAGE_SIZE = 12;

const createSlice = (): SliceState => ({
  items: [],
  cursor: null,
  hasMore: true,
  isLoading: false,
  error: null,
});

const mergeUniqueItems = (current: FeedItem[], incoming: FeedItem[]) => {
  const seen = new Set(current.map((item) => item.feed_id));
  const uniqueIncoming = incoming.filter((item) => {
    if (seen.has(item.feed_id)) return false;
    seen.add(item.feed_id);
    return true;
  });

  return [...current, ...uniqueIncoming];
};

export const useProfileContent = (activeTab: ProfileTab) => {
  const [slices, setSlices] = useState<Record<ProfileTab, SliceState>>({
    posts: createSlice(),
    saved: createSlice(),
    tagged: { ...createSlice(), hasMore: false },
  });
  const inFlightRef = useRef<Record<ProfileTab, boolean>>({
    posts: false,
    saved: false,
    tagged: false,
  });

  const loadMore = useCallback(async () => {
    if (activeTab === "tagged") return;

    const current = slices[activeTab];
    if (current.isLoading || !current.hasMore || inFlightRef.current[activeTab]) return;
    inFlightRef.current[activeTab] = true;

    setSlices((state) => ({
      ...state,
      [activeTab]: { ...state[activeTab], isLoading: true, error: null },
    }));

    try {
      const res =
        activeTab === "saved"
          ? await profileApi.getMeSaved(PAGE_SIZE, current.cursor ?? undefined)
          : await profileApi.getMeContent(PAGE_SIZE, current.cursor ?? undefined);

      setSlices((state) => ({
        ...state,
        [activeTab]: {
          ...state[activeTab],
          items: mergeUniqueItems(state[activeTab].items, res.data),
          cursor: res.meta.nextCursor ?? null,
          hasMore: res.meta.hasNextPage,
          isLoading: false,
        },
      }));
    } catch (err) {
      setSlices((state) => ({
        ...state,
        [activeTab]: {
          ...state[activeTab],
          isLoading: false,
          error: err instanceof Error ? err.message : "Failed to load profile content",
        },
      }));
    } finally {
      inFlightRef.current[activeTab] = false;
    }
  }, [activeTab, slices]);

  useEffect(() => {
    const current = slices[activeTab];
    if (current.items.length === 0 && current.hasMore && !current.isLoading) {
      loadMore();
    }
  }, [activeTab, loadMore, slices]);

  return useMemo(
    () => ({
      ...slices[activeTab],
      loadMore,
    }),
    [activeTab, loadMore, slices],
  );
};
