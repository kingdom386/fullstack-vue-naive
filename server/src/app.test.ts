import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from './app.js'

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
    expect(res.body.data).toHaveLength(2)
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
})

describe('未知路由', () => {
  it('返回统一的 404 响应体', async () => {
    const res = await request(app).get('/api/unknown')

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ success: false, error: 'Resource not found' })
  })
})