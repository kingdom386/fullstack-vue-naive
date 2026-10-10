import type { Request, Response, NextFunction } from 'express'
import { logger } from '../lib/logger.js'

export class AppError extends Error {
  statusCode: number
  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const message = err.message || 'Internal Server Error'

  const log = statusCode >= 500 ? logger.error.bind(logger) : logger.warn.bind(logger)
  log({ err, statusCode, method: req.method, url: req.originalUrl }, message)

  res.status(statusCode).json({
    success: false,
    error: message
  })
}
