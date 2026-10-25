import type { BallState, Drill, DrillStep } from './drills'
import { PITCH_VIEWBOX } from './formation'
import type { PitchPoint, SlotId } from './types'

export type Side = 'left' | 'right'

export const SIDES: readonly Side[] = Object.freeze(['left', 'right'])
export const DEFAULT_SIDE: Side = 'left'

export function parseSide(value: string | null | undefined): Side {
  return value === 'right' ? 'right' : DEFAULT_SIDE
}

/** Which slot takes over a role when the pattern is flipped to the other wing. */
const MIRROR_SLOT: Readonly<Record<SlotId, SlotId>> = Object.freeze({
  ST: 'ST',
  CM: 'CM',
  GK: 'GK',
  LM: 'RM',
  RM: 'LM',
  LCB: 'RCB',
  RCB: 'LCB',
})

const CAPTION_SWAPS: Readonly<Record<string, string>> = Object.freeze({
  left: 'right',
  Left: 'Right',
  right: 'left',
  Right: 'Left',
  LM: 'RM',
  RM: 'LM',
})

function mirrorPoint(point: PitchPoint): PitchPoint {
  return { x: PITCH_VIEWBOX.width - point.x, y: point.y }
}

function mirrorPositions<T extends Partial<Record<SlotId, PitchPoint>>>(positions: T): T {
  const entries = (Object.entries(positions) as [SlotId, PitchPoint][]).map(
    ([slot, point]) => [MIRROR_SLOT[slot], mirrorPoint(point)] as const,
  )
  return Object.fromEntries(entries) as T
}

function mirrorBall(ball: BallState): BallState {
  return 'point' in ball ? { point: mirrorPoint(ball.point) } : { holder: MIRROR_SLOT[ball.holder] }
}

export function mirrorCaption(caption: string): string {
  return caption.replace(/\b(left|Left|right|Right|LM|RM)\b/g, (word) => CAPTION_SWAPS[word] ?? word)
}

function mirrorStep(step: DrillStep): DrillStep {
  return {
    ...step,
    caption: mirrorCaption(step.caption),
    ...(step.move ? { move: mirrorPositions(step.move) } : {}),
    ball: mirrorBall(step.ball),
  }
}

/** The same pattern played up the other wing. Mirroring twice gives the original back. */
export function mirrorDrill(drill: Drill): Drill {
  return {
    ...drill,
    start: mirrorPositions(drill.start),
    steps: drill.steps.map(mirrorStep),
  }
}

export function drillForSide(drill: Drill, side: Side): Drill {
  return side === 'right' ? mirrorDrill(drill) : drill
}
