import { config } from '../config/index.js'
import { logger } from '../lib/logger.js'
import { closePool, db } from './client.js'
import { users } from './schema.js'

const seedUsers = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' }
]

if (config.nodeEnv === 'production') {
  logger.error('禁止在生产环境执行 seed（会清空 users 表）')
  process.exit(1)
}

try {
  // 幂等：每次先清空再写入，便于本地反复执行
  await db.delete(users)
  await db.insert(users).values(seedUsers)
  logger.info(`已写入 ${seedUsers.length} 条初始用户数据`)
} catch (err) {
  logger.error({ err }, '写入初始数据失败')
  process.exitCode = 1
} finally {
  await closePool()
}