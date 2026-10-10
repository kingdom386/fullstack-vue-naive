import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // 固定为 test，避免加载 .env / 启用 pino-pretty transport
    env: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'silent'
    }
  }
})