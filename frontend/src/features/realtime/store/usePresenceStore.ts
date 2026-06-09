import { create } from "zustand";

interface PresenceStore {
  onlineUserIds: string[];
  setOnlineUserIds: (userIds: string[]) => void;
  markOnline: (userId: string) => void;
  markOffline: (userId: string) => void;
  isOnline: (userId: string) => boolean;
}

export const usePresenceStore = create<PresenceStore>((set, get) => ({
  onlineUserIds: [],

  setOnlineUserIds: (userIds) =>
    set({ onlineUserIds: Array.from(new Set(userIds)) }),

  markOnline: (userId) =>
    set((state) => ({
      onlineUserIds: Array.from(new Set([...state.onlineUserIds, userId])),
    })),

  markOffline: (userId) =>
    set((state) => ({
      onlineUserIds: state.onlineUserIds.filter((id) => id !== userId),
    })),

  isOnline: (userId) => get().onlineUserIds.includes(userId),
}));
