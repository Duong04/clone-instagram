import { useFeedStore } from "../store/useFeedStore";
import { feedApi } from "../api/feedApi";
import type { TargetType } from "~/shared/types/feed";
import { useDebounceMap } from "~/shared/hooks/useDebounceMap";

export const useLike = () => {
  const toggleLike = useFeedStore((s) => s.toggleLike);

  const debouncedApi = useDebounceMap(
    async (targetId: string, targetType: TargetType, isLiked: boolean) => {
      try {
        await feedApi.likeFeedItem(targetId, targetType, isLiked);
      } catch {
        toggleLike(targetId);
      }
    },
    1000
  );

  const handleLike = (
    targetId: string,
    targetType: TargetType,
    isLiked: boolean,
  ) => {
    toggleLike(targetId);
    debouncedApi(targetId, targetType, isLiked);
  };

  return { handleLike };
};
