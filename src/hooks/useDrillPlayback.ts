import { useCallback, useEffect, useState } from 'react'
import type { DrillFrame } from '../data/drills'

/** Pause on each frame after the movement finishes, so a step can be read. */
export const HOLD_MS = 700

export interface DrillPlayback {
  readonly index: number
  readonly frame: DrillFrame
  readonly count: number
  readonly playing: boolean
  readonly isFirst: boolean
  readonly isLast: boolean
  readonly play: () => void
  readonly pause: () => void
  readonly next: () => void
  readonly previous: () => void
  readonly restart: () => void
  readonly goTo: (index: number) => void
}

function clamp(index: number, count: number): number {
  return Math.min(Math.max(index, 0), count - 1)
}

/** Steps through drill frames manually or on a timer. */
export function useDrillPlayback(frames: readonly DrillFrame[]): DrillPlayback {
  const count = frames.length
  const [index, setIndex] = useState(0)
  const [playRequested, setPlaying] = useState(false)
  const isLast = index >= count - 1
  // Playback is over once the last frame is reached; no state write needed.
  const playing = playRequested && !isLast

  useEffect(() => {
    if (!playing) return undefined
    const upcoming = frames[index + 1]
    const delay = (upcoming?.durationMs ?? 0) + HOLD_MS
    const timer = setTimeout(() => setIndex((i) => clamp(i + 1, count)), delay)
    return () => clearTimeout(timer)
  }, [playing, index, frames, count])

  const goTo = useCallback(
    (target: number) => {
      setPlaying(false)
      setIndex(clamp(target, count))
    },
    [count],
  )

  const play = useCallback(() => {
    if (isLast) setIndex(0)
    setPlaying(true)
  }, [isLast])

  const frame = frames[clamp(index, count)]
  if (!frame) {
    throw new Error('useDrillPlayback needs at least one frame')
  }

  return {
    index,
    frame,
    count,
    playing,
    isFirst: index === 0,
    isLast,
    play,
    pause: () => setPlaying(false),
    next: () => goTo(index + 1),
    previous: () => goTo(index - 1),
    restart: () => goTo(0),
    goTo,
  }
}
