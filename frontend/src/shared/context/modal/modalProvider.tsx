import React, { useState } from "react";
import { ModalContext } from "./modalContext";

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const openCreatePost = () => setIsCreatePostOpen(true);
  const closeCreatePost = () => setIsCreatePostOpen(false);

  return (
    <ModalContext.Provider value={{ isCreatePostOpen, openCreatePost, closeCreatePost }}>
      {children}
    </ModalContext.Provider>
  );
};