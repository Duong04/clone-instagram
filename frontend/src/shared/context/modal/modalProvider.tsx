import { useState, type ReactNode } from "react";
import { ModalContext } from "./modalContext";
import type { FeedItem } from "~/shared/types/feed";

type Props = {
  children: ReactNode;
};

export const ModalProvider = ({ children }: Props) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<FeedItem | null>(null);

  const openCreatePost = () => setIsCreatePostOpen(true);
  const closeCreatePost = () => setIsCreatePostOpen(false);
  const openPostDetail = (post: FeedItem) => setSelectedPost(post);
  const closePostDetail = () => setSelectedPost(null);

  return (
    <ModalContext.Provider
      value={{
        isCreatePostOpen,
        openCreatePost,
        closeCreatePost,
        selectedPost,
        openPostDetail,
        closePostDetail,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
