import jwt from 'jsonwebtoken'
import { envConfig } from '~/config/env'
import crypto from 'crypto'
import { redis } from '~/config/redis'

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, envConfig.jwtSecret, {
    expiresIn: envConfig.jwtExpires
  })
}

export const generateRefreshToken = async (userId: string) => {
  const refreshToken = crypto.randomBytes(64).toString('hex')

  await redis.set(`refresh:${refreshToken}`, userId, 'EX', 60 * 60 * 24 * 7)

  return refreshToken
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, envConfig.jwtSecret)
}
