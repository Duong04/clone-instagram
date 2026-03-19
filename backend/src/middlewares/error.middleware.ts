import { ZodError } from 'zod'
import { sendError } from '~/utils/response'
import { Request, Response, NextFunction } from 'express'

const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ZodError || (err as ZodError)?.issues !== undefined) {
    const zodErr = err as ZodError
    sendError({
      res,
      message: 'Validation failed',
      statusCode: 400,
      errors: zodErr.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      }))
    })
    return
  }

  if (err instanceof Error) {
    sendError({ res, message: err.message, statusCode: 500 })
    return
  }

  sendError({ res, message: 'Internal server error' })
}

export default errorHandler
