import { Response } from 'express'

export interface Meta {
  nextCursor: string | null
  hasNextPage: boolean
  limit: number
}

interface SuccessOptions<T> {
  res: Response
  data?: T
  meta?: Meta
  message?: string
  statusCode?: number
}

interface ErrorOptions {
  res: Response
  message: string
  statusCode?: number
  errors?: { field: string; message: string }[]
}

export const sendSuccess = <T>({ res, data, meta, message = 'Success', statusCode = 200 }: SuccessOptions<T>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
    ...(meta && { meta })
  })
}

export const sendError = ({ res, message, statusCode = 500, errors }: ErrorOptions) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  })
}
