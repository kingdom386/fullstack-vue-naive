import app from './app.js'
import { config } from './config/index.js'
import { logger } from './lib/logger.js'

const server = app.listen(config.port, () => {
  logger.info(`🚀 Server running on http://localhost:${config.port} (${config.nodeEnv})`)
})

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  server.close(() => process.exit(0))
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  server.close(() => process.exit(0))
})
