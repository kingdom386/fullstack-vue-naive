import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

// 仅用于 drizzle-kit 生成迁移；运行时通过 src/config 读取校验过的 DATABASE_URL
const databaseUrl = process.env.DATABASE_URL ?? 'mysql://root:root@localhost:3306/app'

export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: { url: databaseUrl }
})