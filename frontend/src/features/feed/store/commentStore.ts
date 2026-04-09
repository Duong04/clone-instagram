import { create } from "zustand";
import { commentApi } from "../api/commentApi";

interface Comment {
  id: string;
  content: string;
  parentId?: string;
  [key: string]: unknown;
}

interface ReplySlice {
  replies: Comment[];
  cursor?: string;
  hasMore: boolean;
  loading: boolean;
}

interface CommentStore {
  commentsByTarget: Record<string, Comment[]>;   
  repliesByComment: Record<string, ReplySlice>; 
  loadingTargets: Record<string, boolean>;
  error: string | null;

  fetchComments: (targetId: string) => Promise<void>;
  fetchReplies: (commentId: string, limit?: number) => Promise<void>;
  addComment: (comment: Comment, targetId: string) => void;
  addReply: (reply: Comment, parentId: string) => void;
  updateComment: (id: string, content: string, parentId?: string, targetId?: string) => void;
  removeComment: (id: string, parentId?: string, targetId?: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useCommentStore = create<CommentStore>((set, get) => ({
  commentsByTarget: {},
  repliesByComment: {},
  loadingTargets: {},
  error: null,

  fetchComments: async (targetId) => {
    if (get().loadingTargets[targetId]) return;

    set((s) => ({
      loadingTargets: { ...s.loadingTargets, [targetId]: true },
      error: null,
    }));

    try {
      const data = await commentApi.getComments(targetId);
      set((s) => ({
        commentsByTarget: { ...s.commentsByTarget, [targetId]: data },
        loadingTargets: { ...s.loadingTargets, [targetId]: false },
      }));
    } catch (err) {
      set((s) => ({
        error: err instanceof Error ? err.message : "Failed to load comments",
        loadingTargets: { ...s.loadingTargets, [targetId]: false },
      }));
    }
  },

  fetchReplies: async (commentId, limit = 10) => {
    const existing = get().repliesByComment[commentId];
    if (existing?.loading || existing?.hasMore === false) return;

    set((s) => ({
      repliesByComment: {
        ...s.repliesByComment,
        [commentId]: {
          replies: existing?.replies ?? [],
          cursor: existing?.cursor,
          hasMore: existing?.hasMore ?? true,
          loading: true,
        },
      },
    }));

    try {
      const data = await commentApi.getReplies(commentId, limit, existing?.cursor);
      set((s) => {
        const prev = s.repliesByComment[commentId];
        return {
          repliesByComment: {
            ...s.repliesByComment,
            [commentId]: {
              replies: [...(prev?.replies ?? []), ...(data.items ?? data)],
              cursor: data.nextCursor ?? undefined,
              hasMore: !!data.nextCursor,
              loading: false,
            },
          },
        };
      });
    } catch {
      set((s) => ({
        repliesByComment: {
          ...s.repliesByComment,
          [commentId]: { ...s.repliesByComment[commentId], loading: false },
        },
      }));
    }
  },

  addComment: (comment, targetId) => {
    set((s) => ({
      commentsByTarget: {
        ...s.commentsByTarget,
        [targetId]: [...(s.commentsByTarget[targetId] ?? []), comment],
      },
    }));
  },

  addReply: (reply, parentId) => {
    set((s) => {
      const slice = s.repliesByComment[parentId];
      return {
        repliesByComment: {
          ...s.repliesByComment,
          [parentId]: {
            replies: [...(slice?.replies ?? []), reply],
            cursor: slice?.cursor,
            hasMore: slice?.hasMore ?? true,
            loading: false,
          },
        },
      };
    });
  },

  updateComment: (id, content, parentId, targetId) => {
    set((s) => {
      if (parentId) {
        const slice = s.repliesByComment[parentId];
        return {
          repliesByComment: {
            ...s.repliesByComment,
            [parentId]: {
              ...slice,
              replies: slice?.replies.map((r) =>
                r.id === id ? { ...r, content } : r
              ) ?? [],
            },
          },
        };
      }
      return {
        commentsByTarget: {
          ...s.commentsByTarget,
          [targetId!]: s.commentsByTarget[targetId!]?.map((c) =>
            c.id === id ? { ...c, content } : c
          ) ?? [],
        },
      };
    });
  },

  removeComment: (id, parentId, targetId) => {
    set((s) => {
      if (parentId) {
        const slice = s.repliesByComment[parentId];
        return {
          repliesByComment: {
            ...s.repliesByComment,
            [parentId]: {
              ...slice,
              replies: slice?.replies.filter((r) => r.id !== id) ?? [],
            },
          },
        };
      }
      return {
        commentsByTarget: {
          ...s.commentsByTarget,
          [targetId!]: s.commentsByTarget[targetId!]?.filter((c) => c.id !== id) ?? [],
        },
      };
    });
  },

  setError: (error) => set({ error }),
  reset: () => set({ commentsByTarget: {}, repliesByComment: {}, loadingTargets: {}, error: null }),
}));