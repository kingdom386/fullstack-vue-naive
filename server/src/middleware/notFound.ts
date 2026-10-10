import type { Request, Response } from 'express'
import { AppError } from './errorHandler.js'

export const notFound = (_req: Request, _res: Response, next: (err?: Error) => void) => {
  next(new AppError('Resource not found', 404))
}
