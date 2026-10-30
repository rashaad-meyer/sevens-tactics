import { beforeEach, describe, expect, it, vi } from 'vitest'
import { importWithReload } from '../importWithReload'

describe('importWithReload', () => {
  beforeEach(() => sessionStorage.clear())

  it('passes a successful import straight through', async () => {
    const reload = vi.fn()
    const load = importWithReload(() => Promise.resolve({ default: 'page' }), reload)
    await expect(load()).resolves.toEqual({ default: 'page' })
    expect(reload).not.toHaveBeenCalled()
  })

  it('reloads the page once when the chunk fails to load', async () => {
    const reload = vi.fn()
    const load = importWithReload(() => Promise.reject(new Error('Failed to fetch dynamically imported module')), reload)
    const pending = load()
    await vi.waitFor(() => expect(reload).toHaveBeenCalledTimes(1))
    expect(sessionStorage.getItem('sevens:chunk-reloaded')).toBe('1')
    // The promise stays pending while the page reloads.
    const settled = await Promise.race([pending.then(() => 'settled'), Promise.resolve('pending')])
    expect(settled).toBe('pending')
  })

  it('surfaces the error instead of reloading again after a reload has been tried', async () => {
    sessionStorage.setItem('sevens:chunk-reloaded', '1')
    const reload = vi.fn()
    const load = importWithReload(() => Promise.reject(new Error('still broken')), reload)
    await expect(load()).rejects.toThrow('still broken')
    expect(reload).not.toHaveBeenCalled()
  })

  it('clears the flag once a chunk loads, so a later deploy can reload again', async () => {
    sessionStorage.setItem('sevens:chunk-reloaded', '1')
    await importWithReload(() => Promise.resolve('ok'), vi.fn())()
    expect(sessionStorage.getItem('sevens:chunk-reloaded')).toBeNull()
  })
})
