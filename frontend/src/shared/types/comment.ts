import type { User } from "./auth";

export interface Comment {
  id: string;
  content: string;
  like_count: number;
  created_at: string;
  parentId?: string;
  user: User
  _count: Count
}

export interface Count {
  replies: number
}

export interface ReplySlice {
  replies: Comment[];
  cursor?: string;
  hasMore: boolean;
  loading: boolean;
}