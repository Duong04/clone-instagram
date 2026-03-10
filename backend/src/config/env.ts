import { SignOptions } from 'jsonwebtoken'

export const envConfig = {
  jwtSecret: process.env.JWT_SECRET as string,

  jwtExpires: process.env.JWT_EXPIRES as SignOptions['expiresIn'],
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES as SignOptions['expiresIn']
}
