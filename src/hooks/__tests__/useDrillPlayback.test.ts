import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { DrillFrame } from '../../data/drills'
import { END_HOLD_MS, HOLD_MS, useDrillPlayback } from '../useDrillPlayback'

const positions = {
  ST: { x: 0, y: 0 }, LM: { x: 0, y: 0 }, CM: { x: 0, y: 0 }, RM: { x: 0, y: 0 },
  LCB: { x: 0, y: 0 }, RCB: { x: 0, y: 0 }, GK: { x: 0, y: 0 },
}
const frame = (caption: string, durationMs: number): DrillFrame => ({
  caption, positions, ball: { x: 0, y: 0 }, ballHolder: undefined, durationMs,
})
const FRAMES = [frame('one', 0), frame('two', 500), frame('three', 300)]

describe('useDrillPlayback', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('starts on the first frame, paused', () => {
    const { result } = renderHook(() => useDrillPlayback(FRAMES))
    expect(result.current.index).toBe(0)
    expect(result.current.frame.caption).toBe('one')
    expect(result.current.playing).toBe(false)
    expect(result.current.isFirst).toBe(true)
    expect(result.current.count).toBe(3)
  })

  it('steps manually and clamps at the ends', () => {
    const { result } = renderHook(() => useDrillPlayback(FRAMES))
    act(() => result.current.previous())
    expect(result.current.index).toBe(0)
    act(() => result.current.next())
    act(() => result.current.next())
    act(() => result.current.next())
    expect(result.current.index).toBe(2)
    expect(result.current.isLast).toBe(true)
    act(() => result.current.restart())
    expect(result.current.index).toBe(0)
    act(() => result.current.goTo(1))
    expect(result.current.frame.caption).toBe('two')
  })

  it('auto-advances using each upcoming frame duration plus the hold, then stops', () => {
    const { result } = renderHook(() => useDrillPlayback(FRAMES))
    act(() => result.current.play())
    expect(result.current.playing).toBe(true)
    act(() => vi.advanceTimersByTime(500 + HOLD_MS - 1))
    expect(result.current.index).toBe(0)
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.index).toBe(1)
    act(() => vi.advanceTimersByTime(300 + HOLD_MS))
    expect(result.current.index).toBe(2)
    expect(result.current.playing).toBe(false)
  })

  it('pauses, and replays from the start when played at the end', () => {
    const { result } = renderHook(() => useDrillPlayback(FRAMES))
    act(() => result.current.play())
    act(() => result.current.pause())
    act(() => vi.advanceTimersByTime(10_000))
    expect(result.current.index).toBe(0)
    act(() => result.current.goTo(2))
    act(() => result.current.play())
    expect(result.current.index).toBe(0)
    expect(result.current.playing).toBe(true)
  })

  it('autoplays and loops back to the start after the end hold when asked', () => {
    const { result } = renderHook(() => useDrillPlayback(FRAMES, { autoplay: true, loop: true }))
    expect(result.current.playing).toBe(true)
    act(() => vi.advanceTimersByTime(500 + HOLD_MS))
    expect(result.current.index).toBe(1)
    act(() => vi.advanceTimersByTime(300 + HOLD_MS))
    expect(result.current.index).toBe(2)
    expect(result.current.playing).toBe(true)
    act(() => vi.advanceTimersByTime(END_HOLD_MS - 1))
    expect(result.current.index).toBe(2)
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.index).toBe(0)
    expect(result.current.playing).toBe(true)
  })

  it('a manual step pauses autoplay', () => {
    const { result } = renderHook(() => useDrillPlayback(FRAMES, { autoplay: true, loop: true }))
    act(() => result.current.next())
    expect(result.current.index).toBe(1)
    expect(result.current.playing).toBe(false)
    act(() => vi.advanceTimersByTime(10_000))
    expect(result.current.index).toBe(1)
  })

  it('throws without frames', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useDrillPlayback([]))).toThrow(/at least one frame/)
  })
})
