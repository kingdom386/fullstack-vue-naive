import app from './app.js'
import { config } from './config/index.js'
import { closePool } from './db/client.js'
import { logger } from './lib/logger.js'

const server = app.listen(config.port, () => {
  logger.info(`🚀 Server running on http://localhost:${config.port} (${config.nodeEnv})`)
})

// 先停止接收新请求，再释放数据库连接池
const shutdown = (signal: NodeJS.Signals) => {
  logger.info(`${signal} received, shutting down gracefully`)
  server.close(async () => {
    await closePool()
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
