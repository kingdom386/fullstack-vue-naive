import dotenv from 'dotenv'

dotenv.config()

const NODE_ENVS = ['development', 'production', 'test'] as const
type NodeEnv = (typeof NODE_ENVS)[number]

const DEFAULT_CORS_ORIGIN = 'http://localhost:5173'

function fail(message: string): never {
  console.error(`\n[fatal] 环境变量校验失败: ${message}\n`)
  process.exit(1)
}

function readNodeEnv(): NodeEnv {
  const raw = process.env.NODE_ENV ?? 'development'
  if (!NODE_ENVS.includes(raw as NodeEnv)) {
    fail(`NODE_ENV 必须是 ${NODE_ENVS.join(' / ')} 之一，当前为 "${raw}"`)
  }
  return raw as NodeEnv
}

function readPort(): number {
  const raw = process.env.PORT ?? '3000'
  const port = Number(raw)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    fail(`PORT 必须是 1-65535 之间的整数，当前为 "${raw}"`)
  }
  return port
}

function readCorsOrigin(nodeEnv: NodeEnv): string {
  const raw = process.env.CORS_ORIGIN
  if (!raw) {
    if (nodeEnv === 'production') {
      fail('生产环境必须显式设置 CORS_ORIGIN（不允许回退到默认值）')
    }
    return DEFAULT_CORS_ORIGIN
  }
  try {
    new URL(raw)
  } catch {
    fail(`CORS_ORIGIN 必须是合法 URL，当前为 "${raw}"`)
  }
  return raw
}

const nodeEnv = readNodeEnv()

export const config = {
  port: readPort(),
  nodeEnv,
  corsOrigin: readCorsOrigin(nodeEnv)
}

export type { NodeEnv }