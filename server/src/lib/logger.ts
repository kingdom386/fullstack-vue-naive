import pino from 'pino'
import { config } from '../config/index.js'

const isDev = config.nodeEnv === 'development'

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  // 开发环境使用可读化的彩色输出；生产环境输出结构化 JSON，便于日志采集
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    }
  })
})