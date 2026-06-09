import { io, Socket } from "socket.io-client";

export const SOCKET_EVENTS = {
  READY: "socket:ready",
  ERROR: "socket:error",
  CONTENT_JOIN: "content:join",
  CONTENT_LEAVE: "content:leave",
  COMMENT_TYPING_START: "comment:typing_start",
  COMMENT_TYPING_STOP: "comment:typing_stop",
  COMMENT_CREATED: "comment:created",
  PRESENCE_ONLINE_USERS: "presence:online_users",
  PRESENCE_USER_ONLINE: "presence:user_online",
  PRESENCE_USER_OFFLINE: "presence:user_offline",
} as const;

let socket: Socket | null = null;

export const getSocket = () => socket;

export const connectSocket = () => {
  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_API_URL ?? "http://localhost", {
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: true,
  });

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const onSocketEvent = <T>(
  event: string,
  handler: (payload: T) => void,
) => {
  if (!socket) return () => undefined;

  socket.on(event, handler);
  return () => {
    socket?.off(event, handler);
  };
};
