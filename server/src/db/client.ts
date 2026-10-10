import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'
import { config } from '../config/index.js'
import * as schema from './schema.js'

/** 连接池按需建立连接，此处不会立即连接数据库 */
export const pool = mysql.createPool({
  uri: config.databaseUrl,
  connectionLimit: 10,
  waitForConnections: true
})

export const db = drizzle(pool, { schema, mode: 'default' })

/** 优雅关闭时释放连接池 */
export const closePool = () => pool.end()