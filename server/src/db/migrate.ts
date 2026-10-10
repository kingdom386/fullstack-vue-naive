import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { migrate } from 'drizzle-orm/mysql2/migrator'
import { logger } from '../lib/logger.js'
import { closePool, db } from './client.js'

// 迁移目录与 src 同级：src/db、dist/db 与镜像内的 server/dist/db 均可解析到 server/drizzle
const migrationsFolder = resolve(dirname(fileURLToPath(import.meta.url)), '../../drizzle')

try {
  await migrate(db, { migrationsFolder })
  logger.info('数据库迁移完成')
} catch (err) {
  logger.error({ err }, '数据库迁移失败')
  process.exitCode = 1
} finally {
  await closePool()
}