import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGet = vi.hoisted(() => vi.fn())

vi.mock('axios', () => ({
  default: {
    create: () => ({ get: mockGet })
  }
}))

const { fetchUsers, fetchHealth } = await import('./index')

beforeEach(() => {
  mockGet.mockReset()
})

describe('api client', () => {
  it('fetchUsers 请求 /users 并解包 data 字段', async () => {
    const users = [{ id: 1, name: 'Alice', email: 'alice@example.com' }]
    mockGet.mockResolvedValue({ data: { success: true, data: users } })

    await expect(fetchUsers()).resolves.toEqual(users)
    expect(mockGet).toHaveBeenCalledWith('/users')
  })

  it('fetchHealth 请求 /health 并返回完整响应体', async () => {
    const payload = { success: true, status: 'ok', timestamp: '2026-01-01T00:00:00.000Z' }
    mockGet.mockResolvedValue({ data: payload })

    await expect(fetchHealth()).resolves.toEqual(payload)
    expect(mockGet).toHaveBeenCalledWith('/health')
  })
})