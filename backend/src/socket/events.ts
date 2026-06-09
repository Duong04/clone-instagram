export const SOCKET_EVENTS = {
  READY: 'socket:ready',
  ERROR: 'socket:error',
  CONTENT_JOIN: 'content:join',
  CONTENT_LEAVE: 'content:leave',
  COMMENT_TYPING_START: 'comment:typing_start',
  COMMENT_TYPING_STOP: 'comment:typing_stop',
  COMMENT_CREATED: 'comment:created',
  PRESENCE_ONLINE_USERS: 'presence:online_users',
  PRESENCE_USER_ONLINE: 'presence:user_online',
  PRESENCE_USER_OFFLINE: 'presence:user_offline'
} as const

export const userRoom = (userId: string) => `user:${userId}`
export const contentRoom = (targetType: string, targetId: string) => `content:${targetType}:${targetId}`
