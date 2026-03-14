import type { Post, User, Story, Chat } from "./types";

export const MOCK_USER: User = {
  id: "me",
  username: "johndoe",
  fullName: "John Doe",
  avatar: "https://picsum.photos/seed/me/150/150",
};

export const MOCK_STORIES: Story[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `story-${i}`,
  user: {
    id: `user-${i}`,
    username: `user_${i}`,
    fullName: `User ${i}`,
    avatar: `https://picsum.photos/seed/user${i}/150/150`,
  },
  hasSeen: false,
}));

export const MOCK_POSTS: Post[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `post-${i}`,
  user: {
    id: `user-${i % 5}`,
    username: `photographer_${i % 5}`,
    fullName: `Photographer ${i % 5}`,
    avatar: `https://picsum.photos/seed/user${i % 5}/150/150`,
    isVerified: i % 3 === 0,
  },
  image: `https://picsum.photos/seed/post${i}/600/600`,
  caption: `Beautiful day at the beach! #summer #vibes #photography ${i}`,
  likes: Math.floor(Math.random() * 10000),
  comments: Math.floor(Math.random() * 500),
  timestamp: "2h",
  isLiked: false,
  isSaved: false,
}));

export const MOCK_CHATS: Chat[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `chat-${i}`,
  user: {
    id: `user-${i + 10}`,
    username: `friend_${i}`,
    fullName: `Friend ${i}`,
    avatar: `https://picsum.photos/seed/friend${i}/150/150`,
  },
  lastMessage: "Hey, how's it going?",
  timestamp: "1h",
  unreadCount: i < 2 ? i + 1 : 0,
}));
