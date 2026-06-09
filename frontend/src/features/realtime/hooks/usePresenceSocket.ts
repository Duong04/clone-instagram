import { useEffect } from "react";
import { useAuthStore } from "~/features/auth/store/useAuthStore";
import { usePresenceStore } from "../store/usePresenceStore";
import { getSocket, SOCKET_EVENTS } from "~/shared/libs/socket";

export const usePresenceSocket = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const setOnlineUserIds = usePresenceStore((s) => s.setOnlineUserIds);
  const markOnline = usePresenceStore((s) => s.markOnline);
  const markOffline = usePresenceStore((s) => s.markOffline);

  useEffect(() => {
    if (!isLoggedIn) {
      setOnlineUserIds([]);
      return;
    }

    const socket = getSocket();
    if (!socket) return;

    const handleOnlineUsers = (userIds: string[]) => setOnlineUserIds(userIds);
    const handleUserOnline = ({ userId }: { userId: string }) => markOnline(userId);
    const handleUserOffline = ({ userId }: { userId: string }) => markOffline(userId);

    socket.on(SOCKET_EVENTS.PRESENCE_ONLINE_USERS, handleOnlineUsers);
    socket.on(SOCKET_EVENTS.PRESENCE_USER_ONLINE, handleUserOnline);
    socket.on(SOCKET_EVENTS.PRESENCE_USER_OFFLINE, handleUserOffline);

    return () => {
      socket.off(SOCKET_EVENTS.PRESENCE_ONLINE_USERS, handleOnlineUsers);
      socket.off(SOCKET_EVENTS.PRESENCE_USER_ONLINE, handleUserOnline);
      socket.off(SOCKET_EVENTS.PRESENCE_USER_OFFLINE, handleUserOffline);
    };
  }, [isLoggedIn, markOffline, markOnline, setOnlineUserIds]);
};
