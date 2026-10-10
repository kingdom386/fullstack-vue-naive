import app from './app.js'
import { config } from './config/index.js'

const server = app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port} (${config.nodeEnv})`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => process.exit(0))
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  server.close(() => process.exit(0))
})
