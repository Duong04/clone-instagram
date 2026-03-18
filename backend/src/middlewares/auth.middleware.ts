import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '~/utils/jwt'
import { sendError } from '~/utils/response'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token

  if (!token) {
    return sendError({
      res,
      message: 'Unauthorized',
      statusCode: 401
    })
  }

  try {
    const decoded = verifyAccessToken(token)

    req.user = decoded as { id: string }

    next()
  } catch {
    return sendError({
      res,
      message: 'Invalid token',
      statusCode: 401
    })
  }
}
