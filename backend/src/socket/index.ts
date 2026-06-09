import { Server } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'
import { ContentType } from '~/generated/prisma/client'
import { verifyAccessToken } from '~/utils/jwt'
import { contentRoom, SOCKET_EVENTS, userRoom } from './events'

type SocketUser = { id: string }
type AuthedSocket = Socket & { data: { user: SocketUser } }

let io: SocketServer | null = null
const onlineUsers = new Map<string, Set<string>>()

function parseCookie(header?: string) {
  if (!header) return {}

  return header.split(';').reduce<Record<string, string>>((acc, item) => {
    const [rawKey, ...rawValue] = item.trim().split('=')
    if (!rawKey) return acc
    acc[rawKey] = decodeURIComponent(rawValue.join('='))
    return acc
  }, {})
}

function getTokenFromSocket(socket: Socket) {
  const cookies = parseCookie(socket.handshake.headers.cookie)
  return cookies.access_token ?? socket.handshake.auth?.token
}

function addOnlineUser(userId: string, socketId: string) {
  const sockets = onlineUsers.get(userId) ?? new Set<string>()
  sockets.add(socketId)
  onlineUsers.set(userId, sockets)
  return sockets.size === 1
}

function removeOnlineUser(userId: string, socketId: string) {
  const sockets = onlineUsers.get(userId)
  if (!sockets) return false

  sockets.delete(socketId)
  if (sockets.size > 0) return false

  onlineUsers.delete(userId)
  return true
}

export function initSocket(server: Server) {
  const allowedOrigins = process.env.CLIENT_URL?.split(',') ?? []

  io = new SocketServer(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST']
    }
  })

  io.use((socket, next) => {
    try {
      const token = getTokenFromSocket(socket)
      if (!token) return next(new Error('Unauthorized'))

      const decoded = verifyAccessToken(token) as SocketUser
      socket.data.user = { id: decoded.id }
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket: Socket) => {
    const authedSocket = socket as AuthedSocket
    const userId = authedSocket.data.user.id
    const becameOnline = addOnlineUser(userId, socket.id)

    socket.join(userRoom(userId))
    socket.emit(SOCKET_EVENTS.READY, {
      socketId: socket.id,
      userId
    })
    socket.emit(SOCKET_EVENTS.PRESENCE_ONLINE_USERS, getOnlineUserIds())

    if (becameOnline) {
      socket.broadcast.emit(SOCKET_EVENTS.PRESENCE_USER_ONLINE, { userId })
    }

    socket.on(SOCKET_EVENTS.CONTENT_JOIN, ({ targetId, targetType }: { targetId?: string; targetType?: ContentType }) => {
      if (!targetId || !targetType || !Object.values(ContentType).includes(targetType)) return
      socket.join(contentRoom(targetType, targetId))
    })

    socket.on(
      SOCKET_EVENTS.CONTENT_LEAVE,
      ({ targetId, targetType }: { targetId?: string; targetType?: ContentType }) => {
        if (!targetId || !targetType || !Object.values(ContentType).includes(targetType)) return
        socket.leave(contentRoom(targetType, targetId))
      }
    )

    socket.on(
      SOCKET_EVENTS.COMMENT_TYPING_START,
      ({ targetId, targetType, username }: { targetId?: string; targetType?: ContentType; username?: string }) => {
        if (!targetId || !targetType || !Object.values(ContentType).includes(targetType)) return
        socket.to(contentRoom(targetType, targetId)).emit(SOCKET_EVENTS.COMMENT_TYPING_START, {
          targetId,
          targetType,
          userId,
          username
        })
      }
    )

    socket.on(
      SOCKET_EVENTS.COMMENT_TYPING_STOP,
      ({ targetId, targetType }: { targetId?: string; targetType?: ContentType }) => {
        if (!targetId || !targetType || !Object.values(ContentType).includes(targetType)) return
        socket.to(contentRoom(targetType, targetId)).emit(SOCKET_EVENTS.COMMENT_TYPING_STOP, {
          targetId,
          targetType,
          userId
        })
      }
    )

    socket.on('disconnect', () => {
      const becameOffline = removeOnlineUser(userId, socket.id)
      if (becameOffline) {
        socket.broadcast.emit(SOCKET_EVENTS.PRESENCE_USER_OFFLINE, { userId })
      }
    })
  })

  return io
}

export function getIO() {
  if (!io) {
    throw new Error('Socket server has not been initialized')
  }
  return io
}

export function getOnlineUserIds() {
  return Array.from(onlineUsers.keys())
}

export function isUserOnline(userId: string) {
  return onlineUsers.has(userId)
}

export function emitToUser<T>(userId: string, event: string, payload: T) {
  getIO().to(userRoom(userId)).emit(event, payload)
}

export function emitToUsers<T>(userIds: string[], event: string, payload: T) {
  userIds.forEach((userId) => emitToUser(userId, event, payload))
}

export function emitToContent<T>(targetType: string, targetId: string, event: string, payload: T) {
  getIO().to(contentRoom(targetType, targetId)).emit(event, payload)
}

export function broadcast<T>(event: string, payload: T) {
  getIO().emit(event, payload)
}
