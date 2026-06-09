import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "~/features/auth/store/useAuthStore";
import { useFeedStore } from "../store/useFeedStore";
import { useCommentStore } from "../store/useCommentStore";
import type { Comment } from "~/shared/types/comment";
import type { TargetType } from "~/shared/types/feed";
import { getSocket, SOCKET_EVENTS } from "~/shared/libs/socket";

type CommentCreatedPayload = {
  targetId: string;
  targetType: TargetType;
  parentId: string | null;
  comment: Comment;
};

type CommentTypingPayload = {
  targetId: string;
  targetType: TargetType;
  userId: string;
  username?: string;
};

export const useRealtimeComments = (
  targetId: string,
  targetType: TargetType,
  feedId = targetId,
) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const userId = useAuthStore((s) => s.user?.id);
  const username = useAuthStore((s) => s.user?.username);
  const addComment = useCommentStore((s) => s.addComment);
  const addReply = useCommentStore((s) => s.addReply);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const typingStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingUsersTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (!isLoggedIn || !targetId) return;

    const socket = getSocket();
    if (!socket) return;

    const roomPayload = { targetId, targetType };

    const hasComment = (commentId: string) => {
      const state = useCommentStore.getState();
      return (state.commentsByTarget[targetId] ?? []).some((comment) => comment.id === commentId);
    };

    const syncFeedCommentCount = () => {
      useFeedStore.setState((state) => ({
        feed: state.feed.map((item) =>
          item.feed_id === feedId
            ? { ...item, comment_count: (item.comment_count ?? 0) + 1 }
            : item,
        ),
      }));
    };

    const handleCommentCreated = (payload: CommentCreatedPayload) => {
      if (payload.targetId !== targetId || payload.targetType !== targetType) return;
      if (payload.comment.user?.id === userId) return;

      if (payload.parentId) {
        addReply(payload.comment, payload.parentId);
        syncFeedCommentCount();
        return;
      }

      const alreadyExists = hasComment(payload.comment.id);
      addComment(payload.comment, targetId);
      if (!alreadyExists) syncFeedCommentCount();
    };

    const handleTypingStart = (payload: CommentTypingPayload) => {
      if (payload.targetId !== targetId || payload.targetType !== targetType) return;
      if (payload.userId === userId) return;

      setTypingUsers((state) => ({
        ...state,
        [payload.userId]: payload.username ?? "Someone",
      }));

      clearTimeout(typingUsersTimers.current[payload.userId]);
      typingUsersTimers.current[payload.userId] = setTimeout(() => {
        setTypingUsers((state) => {
          const next = { ...state };
          delete next[payload.userId];
          return next;
        });
      }, 3500);
    };

    const handleTypingStop = (payload: CommentTypingPayload) => {
      if (payload.targetId !== targetId || payload.targetType !== targetType) return;

      clearTimeout(typingUsersTimers.current[payload.userId]);
      setTypingUsers((state) => {
        const next = { ...state };
        delete next[payload.userId];
        return next;
      });
    };

    socket.emit(SOCKET_EVENTS.CONTENT_JOIN, roomPayload);
    socket.on(SOCKET_EVENTS.COMMENT_CREATED, handleCommentCreated);
    socket.on(SOCKET_EVENTS.COMMENT_TYPING_START, handleTypingStart);
    socket.on(SOCKET_EVENTS.COMMENT_TYPING_STOP, handleTypingStop);

    return () => {
      socket.emit(SOCKET_EVENTS.CONTENT_LEAVE, roomPayload);
      socket.off(SOCKET_EVENTS.COMMENT_CREATED, handleCommentCreated);
      socket.off(SOCKET_EVENTS.COMMENT_TYPING_START, handleTypingStart);
      socket.off(SOCKET_EVENTS.COMMENT_TYPING_STOP, handleTypingStop);
      Object.values(typingUsersTimers.current).forEach(clearTimeout);
      typingUsersTimers.current = {};
    };
  }, [addComment, addReply, feedId, isLoggedIn, targetId, targetType, userId]);

  const sendTyping = useCallback(() => {
    if (!isLoggedIn || !targetId) return;
    const socket = getSocket();
    if (!socket) return;

    socket.emit(SOCKET_EVENTS.COMMENT_TYPING_START, {
      targetId,
      targetType,
      username,
    });

    if (typingStopTimer.current) clearTimeout(typingStopTimer.current);
    typingStopTimer.current = setTimeout(() => {
      socket.emit(SOCKET_EVENTS.COMMENT_TYPING_STOP, { targetId, targetType });
    }, 1200);
  }, [isLoggedIn, targetId, targetType, username]);

  const stopTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !targetId) return;
    if (typingStopTimer.current) clearTimeout(typingStopTimer.current);
    socket.emit(SOCKET_EVENTS.COMMENT_TYPING_STOP, { targetId, targetType });
  }, [targetId, targetType]);

  return {
    typingUsers: Object.values(typingUsers),
    sendTyping,
    stopTyping,
  };
};
