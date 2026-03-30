import { useState, type ReactNode } from "react";
import { ModalContext } from "./modalContext";

type Props = {
  children: ReactNode;
};

export const ModalProvider = ({ children }: Props) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const openCreatePost = () => setIsCreatePostOpen(true);
  const closeCreatePost = () => setIsCreatePostOpen(false);

  return (
    <ModalContext.Provider value={{ isCreatePostOpen, openCreatePost, closeCreatePost }}>
      {children}
    </ModalContext.Provider>
  );
};