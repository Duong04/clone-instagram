import { useCallback, useRef } from "react";
import { feedApi } from "../api/feedApi";
import type { TargetType } from "~/shared/types/feed";
import { useIntersection } from "~/shared/hooks/useIntersection";

export const useMarkAsSeen = (targetId: string, targetType: TargetType) => {
  const markedRef = useRef(false);

  const markAsSeen = useCallback(() => {
    if (markedRef.current) return;
    markedRef.current = true;

    feedApi.markAsSeen(targetId, targetType).catch(() => {
      markedRef.current = false;
    });
  }, [targetId, targetType]);

  return useIntersection(markAsSeen, { threshold: 0.6 });
};
