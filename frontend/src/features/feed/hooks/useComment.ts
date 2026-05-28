import { useCallback, useRef, useState } from "react";
import { useCommentStore } from "../store/useCommentStore";
import { useFeedStore } from "../store/useFeedStore";
import { commentApi } from "../api/commentApi";
import type { TargetType } from "~/shared/types/feed";
import { useDebounceMap } from "~/shared/hooks/useDebounceMap";

export const useComment = (targetId: string, targetType: TargetType) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    commentsByTarget,
    cursorByTarget,
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
    replyCountByComment
  } = useCommentStore();

  const hasMoreComments = cursorByTarget[targetId]?.hasMore ?? true;

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
    fetchComments(targetId, targetType);
  }, [fetchComments, targetId, targetType]);

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
          setSubmitting(true);
          try {
            const newComment = await commentApi.createComment(
              content,
              targetId,
              targetType,
              parentId,
            );
            if (parentId) {
              addReply(newComment.data, parentId);
            } else {
              addComment(newComment.data, targetId);
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
    ],
  );

  const editComment = useCallback(
    async (id: string, content: string, parentId?: string) => {
      if (!content.trim()) return;

      debounceRef.current(`update-${id}`, async () => {
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
    [targetId, storeUpdate, setError],
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
    hasMoreComments,
    isLoading,
    submitting,
    error,
    repliesByComment,
    replyCountByComment,
    loadComments,
    loadReplies,
    createComment,
    editComment,
    deleteComment,
    clearError,
  };
};
