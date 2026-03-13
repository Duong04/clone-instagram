import { Request, Response, NextFunction } from 'express'
import authService from '~/services/auth.service'
import { registerSchema } from '~/dto/auth/register.dto'
import { loginSchema } from '~/dto/auth/login.dto'
import { refreshSchema } from '~/dto/auth/refresh.dto'
import { sendSuccess } from '~/utils/response'

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = registerSchema.parse(req.body)
      const user = await authService.register(body)
      sendSuccess({ res, data: user, message: 'Registered successfully', statusCode: 201 })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = loginSchema.parse(req.body)
      const result = await authService.login(body.email, body.password)
      sendSuccess({ res, data: result })
    } catch (error) {
      next(error)
    }
  }

  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.profile(req.user!.id)
      sendSuccess({ res, data: user })
    } catch (error) {
      next(error)
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const body = refreshSchema.parse(req.body)
      const result = await authService.refresh(body.refreshToken)
      sendSuccess({ res, data: result })
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const body = refreshSchema.parse(req.body)
      await authService.logout(body.refreshToken)
      sendSuccess({ res, message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
