import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import app from './app.js'
import { findUserById, listUsers } from './repositories/userRepository.js'

// 仓储层被 mock，测试不依赖真实数据库（CI 无需 DB 服务）
vi.mock('./repositories/userRepository.js', () => ({
  listUsers: vi.fn(),
  findUserById: vi.fn()
}))

const mockedListUsers = vi.mocked(listUsers)
const mockedFindUserById = vi.mocked(findUserById)

const alice = { id: 1, name: 'Alice', email: 'alice@example.com' }
const bob = { id: 2, name: 'Bob', email: 'bob@example.com' }

beforeEach(() => {
  vi.clearAllMocks()
  mockedListUsers.mockResolvedValue([alice, bob])
  mockedFindUserById.mockImplementation(async id => (id === 1 ? alice : undefined))
})

describe('GET /api/health', () => {
  it('返回 200 与 ok 状态', async () => {
    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ success: true, status: 'ok' })
    expect(typeof res.body.timestamp).toBe('string')
  })
})

describe('GET /api/users', () => {
  it('返回用户列表', async () => {
    const res = await request(app).get('/api/users')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toEqual([alice, bob])
    expect(mockedListUsers).toHaveBeenCalledOnce()
  })

  it('按 id 返回单个用户', async () => {
    const res = await request(app).get('/api/users/1')

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ id: 1, name: 'Alice' })
  })

  it('用户不存在时返回 404', async () => {
    const res = await request(app).get('/api/users/999')

    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
  })

  it('id 非法时返回 400 且不查询数据库', async () => {
    const res = await request(app).get('/api/users/abc')

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(mockedFindUserById).not.toHaveBeenCalled()
  })
})

describe('未知路由', () => {
  it('返回统一的 404 响应体', async () => {
    const res = await request(app).get('/api/unknown')

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ success: false, error: 'Resource not found' })
  })
})