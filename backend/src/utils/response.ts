import { Response } from 'express'

interface SuccessOptions<T> {
  res: Response
  data?: T
  message?: string
  statusCode?: number
}

interface ErrorOptions {
  res: Response
  message: string
  statusCode?: number
  errors?: { field: string; message: string }[]
}

export const sendSuccess = <T>({ res, data, message = 'Success', statusCode = 200 }: SuccessOptions<T>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null
  })
}

export const sendError = ({ res, message, statusCode = 500, errors }: ErrorOptions) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  })
}
