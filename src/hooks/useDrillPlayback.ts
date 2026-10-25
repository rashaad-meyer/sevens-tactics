import { useCallback, useEffect, useState } from 'react'
import type { DrillFrame } from '../data/drills'

/** Pause on each frame after the movement finishes, so a step can be read. */
export const HOLD_MS = 150
/** Longer pause on the final frame before looping back to the start. */
export const END_HOLD_MS = 900

export interface DrillPlaybackOptions {
  /** Start playing as soon as the drill mounts. */
  readonly autoplay?: boolean
  /** Return to the first frame after the last one instead of stopping. */
  readonly loop?: boolean
}

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

/** Steps through drill frames manually or on a timer. Manual steps pause playback. */
export function useDrillPlayback(
  frames: readonly DrillFrame[],
  { autoplay = false, loop = false }: DrillPlaybackOptions = {},
): DrillPlayback {
  const count = frames.length
  const [index, setIndex] = useState(0)
  const [playRequested, setPlaying] = useState(autoplay)
  const isLast = index >= count - 1
  // Without looping, playback is over once the last frame is reached.
  const playing = playRequested && (loop || !isLast)

  useEffect(() => {
    if (!playing) return undefined
    if (isLast) {
      const timer = setTimeout(() => setIndex(0), END_HOLD_MS)
      return () => clearTimeout(timer)
    }
    const upcoming = frames[index + 1]
    const delay = (upcoming?.durationMs ?? 0) + HOLD_MS
    const timer = setTimeout(() => setIndex((i) => clamp(i + 1, count)), delay)
    return () => clearTimeout(timer)
  }, [playing, isLast, index, frames, count])

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
