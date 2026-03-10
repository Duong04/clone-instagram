import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '~/utils/jwt'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = verifyAccessToken(token)

    req.user = decoded as { id: string }

    next()
  } catch {
    return res.status(401).json({
      message: 'Invalid token'
    })
  }
}
