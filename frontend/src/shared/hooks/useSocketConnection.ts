import { useEffect } from "react";
import { useAuthStore } from "~/features/auth/store/useAuthStore";
import { connectSocket, disconnectSocket, SOCKET_EVENTS } from "~/shared/libs/socket";

export const useSocketConnection = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isLoggedIn) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();

    const handleConnectError = (error: Error) => {
      console.error(SOCKET_EVENTS.ERROR, error.message);
    };

    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect_error", handleConnectError);
    };
  }, [isInitialized, isLoggedIn]);
};
