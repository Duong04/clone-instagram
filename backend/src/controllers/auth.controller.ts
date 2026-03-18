import { Request, Response, NextFunction } from 'express'
import authService from '~/services/auth.service'
import { registerSchema } from '~/dto/auth/register.dto'
import { loginSchema } from '~/dto/auth/login.dto'
import { sendError, sendSuccess } from '~/utils/response'
import { ACCESS_TOKEN_OPTIONS, REFRESH_TOKEN_OPTIONS } from '~/utils/cookie'

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
      const { accessToken, refreshToken, user } = await authService.login(body.email, body.password)

      res.cookie('access_token', accessToken, ACCESS_TOKEN_OPTIONS)

      res.cookie('refresh_token', refreshToken, REFRESH_TOKEN_OPTIONS)

      sendSuccess({ res, data: user })
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
      const refreshToken = req.cookies.refresh_token

      if (!refreshToken) {
        sendError({ res, message: 'No refresh token', statusCode: 401 })
        return
      }

      const result = await authService.refresh(refreshToken)

      res.cookie('access_token', result.accessToken, ACCESS_TOKEN_OPTIONS)

      res.cookie('refresh_token', result.refreshToken, REFRESH_TOKEN_OPTIONS)

      sendSuccess({ res, data: result.user, message: 'Token refreshed' })
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refresh_token
      if (refreshToken) {
        await authService.logout(refreshToken)
      }

      res.clearCookie('access_token')
      res.clearCookie('refresh_token')
      sendSuccess({ res, message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
