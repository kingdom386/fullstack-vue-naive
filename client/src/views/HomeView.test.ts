import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import HomeView from './HomeView.vue'

vi.mock('@/api', () => ({
  fetchHealth: vi.fn().mockResolvedValue({
    status: 'ok',
    timestamp: '2026-01-01T00:00:00.000Z'
  })
}))

describe('HomeView', () => {
  it('挂载后展示后端健康状态', async () => {
    const wrapper = mount(HomeView)
    await flushPromises()

    expect(wrapper.text()).toContain('状态: ok')
    expect(wrapper.text()).toContain('2026-01-01T00:00:00.000Z')
  })
})