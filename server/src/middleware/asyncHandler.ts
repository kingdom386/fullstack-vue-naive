import type { NextFunction, Request, RequestHandler, Response } from 'express'

/**
 * 包装 async 控制器：Express 4 不会自动捕获 Promise rejection，
 * 未包装时异步异常不会进入 errorHandler，请求会一直悬挂。
 */
export const asyncHandler =
  (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
  ): RequestHandler =>
  (req, res, next) => {
    handler(req, res, next).catch(next)
  }