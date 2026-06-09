import { useFeedStore } from "../store/useFeedStore";
import { feedApi } from "../api/feedApi";
import type { TargetType } from "~/shared/types/feed";
import { useDebounceMap } from "~/shared/hooks/useDebounceMap";

export const useLike = () => {
  const toggleLike = useFeedStore((s) => s.toggleLike);

  const debouncedApi = useDebounceMap(
    async (feedId: string, targetId: string, targetType: TargetType, isLiked: boolean) => {
      try {
        await feedApi.likeFeedItem(targetId, targetType, isLiked);
      } catch {
        toggleLike(feedId);
      }
    },
    1000
  );

  const handleLike = (
    feedId: string,
    targetId: string,
    targetType: TargetType,
    isLiked: boolean,
  ) => {
    toggleLike(feedId);
    debouncedApi(feedId, targetId, targetType, isLiked);
  };

  return { handleLike };
};
