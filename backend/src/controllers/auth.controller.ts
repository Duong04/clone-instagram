import { Request, Response } from 'express'
import authService from '~/services/auth.service'
import { registerSchema } from '~/dto/auth/register.dto'
import { loginSchema } from '~/dto/auth/login.dto'
import { refreshSchema } from '~/dto/auth/refresh.dto'

class AuthController {
  async register(req: Request, res: Response) {
    const body = registerSchema.parse(req.body)

    const user = await authService.register(body)

    res.status(201).json({
      success: true,
      data: user
    })
  }

  async login(req: Request, res: Response) {
    try {
      const body = loginSchema.parse(req.body)

      const result = await authService.login(body.email, body.password)

      res.json({
        success: true,
        data: result
      })
    } catch (error) {
      res.json({
        success: false,
        message: error.message
      })
    }
  }

  async refresh(req: Request, res: Response) {
    const body = refreshSchema.parse(req.body)

    const result = await authService.refresh(body.refreshToken)

    res.json({
      success: true,
      data: result
    })
  }

  async profile(req: Request, res: Response) {
    const user = await authService.profile(req.user!.id)

    res.json({
      success: true,
      data: user
    })
  }

  async logout(req: Request, res: Response) {
    const body = refreshSchema.parse(req.body)

    const result = await authService.logout(body.refreshToken)

    res.json({
      success: true,
      data: result
    })
  }
}

export default new AuthController()
