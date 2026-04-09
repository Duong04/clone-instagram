import { useCallback, useRef, useState } from "react";
import { useCommentStore } from "../store/commentStore";
import { useFeedStore } from "../store/feedStore";
import { commentApi } from "../api/commentApi";
import type { TargetType } from "~/shared/types/feed";
import { useDebounceMap } from "~/shared/hooks/useDebounceMap";

export const useComment = (targetId: string, targetType: TargetType) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    commentsByTarget,
    repliesByComment,
    loadingTargets,
    error,
    fetchComments,
    fetchReplies,
    addComment,
    addReply,
    updateComment: storeUpdate,
    removeComment,
    setError,
  } = useCommentStore();

  const syncFeedCommentCount = useCallback(
    (delta: number) => {
      const { feed } = useFeedStore.getState();
      if (feed.some((f) => f.feed_id === targetId)) {
        useFeedStore.setState((fs) => ({
          feed: fs.feed.map((f) =>
            f.feed_id === targetId
              ? { ...f, comment_count: (f.comment_count ?? 0) + delta }
              : f,
          ),
        }));
      }
    },
    [targetId],
  );

  const debounceRef = useRef(
    useDebounceMap(async (_key: string, callback: () => Promise<void>) => {
      await callback();
    }, 500),
  );

  const comments = commentsByTarget[targetId] ?? [];
  const isLoading = loadingTargets[targetId] ?? false;

  const loadComments = useCallback(() => {
    fetchComments(targetId);
  }, [fetchComments, targetId]);

  const loadReplies = useCallback(
    (commentId: string, limit?: number) => {
      fetchReplies(commentId, limit);
    },
    [fetchReplies],
  );

  const createComment = useCallback(
    async (content: string, parentId?: string) => {
      if (!content.trim() || submitting) return;

      debounceRef.current(
        `create-${targetId}-${parentId ?? "root"}`,
        async () => {
          // ✅
          setSubmitting(true);
          try {
            const newComment = await commentApi.createComment(
              content,
              targetId,
              targetType,
              parentId,
            );
            if (parentId) {
              addReply(newComment, parentId);
            } else {
              addComment(newComment, targetId);
            }
            syncFeedCommentCount(+1);
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Failed to post comment",
            );
          } finally {
            setSubmitting(false);
          }
        },
      );
    },
    [
      submitting,
      targetId,
      targetType,
      addComment,
      addReply,
      setError,
      syncFeedCommentCount,
    ], // ✅ bỏ setDebounce
  );

  const editComment = useCallback(
    async (id: string, content: string, parentId?: string) => {
      if (!content.trim()) return;

      debounceRef.current(`update-${id}`, async () => {
        // ✅
        try {
          await commentApi.updateComment(id, content);
          storeUpdate(id, content, parentId, targetId);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to update comment",
          );
        }
      });
    },
    [targetId, storeUpdate, setError], // ✅ bỏ setDebounce
  );

  const deleteComment = useCallback(
    async (id: string, parentId?: string) => {
      try {
        await commentApi.deleteComment(id);
        removeComment(id, parentId, targetId);
        syncFeedCommentCount(-1);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete comment",
        );
      }
    },
    [targetId, removeComment, setError, syncFeedCommentCount],
  );

  const clearError = useCallback(() => setError(null), [setError]);

  return {
    comments,
    isLoading,
    submitting,
    error,
    repliesByComment,
    loadComments,
    loadReplies,
    createComment,
    editComment,
    deleteComment,
    clearError,
  };
};
