import { FORMATION_231 } from './formation'
import type { PitchPoint, SlotId } from './types'

export type DrillId = 'attacking-1'

export type BallState =
  | { readonly holder: SlotId }
  | { readonly point: PitchPoint }

export interface DrillStep {
  readonly caption: string
  /** Slots that move in this step. Others keep their previous position. */
  readonly move?: Partial<Record<SlotId, PitchPoint>>
  readonly ball: BallState
  /** How long players and ball take to reach this step. */
  readonly durationMs: number
}

export interface Drill {
  readonly kind: 'drill'
  readonly id: DrillId
  readonly name: string
  readonly description: string
  readonly start: Readonly<Record<SlotId, PitchPoint>>
  readonly steps: readonly DrillStep[]
}

export interface DrillFrame {
  readonly caption: string
  readonly positions: Readonly<Record<SlotId, PitchPoint>>
  readonly ball: PitchPoint
  readonly ballHolder: SlotId | undefined
  readonly durationMs: number
}

/** Ball sits just off the holder's disc so the position code stays legible. */
export const BALL_OFFSET: PitchPoint = Object.freeze({ x: 6, y: 5 })

const ATTACK_START = Object.fromEntries(
  FORMATION_231.map((slot) => [slot.slotId, { x: slot.x, y: slot.y }]),
) as Record<SlotId, PitchPoint>

export const DRILLS: readonly Drill[] = Object.freeze([
  {
    kind: 'drill',
    id: 'attacking-1',
    name: 'Attacking Pattern 1',
    description:
      'Build down the left: GK to the defender, into the dropping wide midfielder, inside to the CM, through ball for the striker.',
    start: { ...ATTACK_START, LCB: { x: 27, y: 123 } },
    steps: [
      {
        caption: 'Set up. GK has the ball and the left defender takes the corner of the box.',
        ball: { holder: 'GK' },
        durationMs: 0,
      },
      {
        caption: 'GK plays it out to the defender.',
        ball: { holder: 'LCB' },
        durationMs: 900,
      },
      {
        caption: 'The left midfielder drops a little to show for the ball.',
        move: { LM: { x: 19, y: 86 } },
        ball: { holder: 'LCB' },
        durationMs: 900,
      },
      {
        caption: 'Defender passes up the line to the left midfielder.',
        ball: { holder: 'LM' },
        durationMs: 800,
      },
      {
        caption: 'The CM drifts wide into the space the midfielder has left.',
        move: { CM: { x: 33, y: 62 } },
        ball: { holder: 'LM' },
        durationMs: 900,
      },
      {
        caption: 'Left midfielder lays it inside to the CM.',
        ball: { holder: 'CM' },
        durationMs: 800,
      },
      {
        caption: 'The striker drifts a little wide towards the same side.',
        move: { ST: { x: 36, y: 32 } },
        ball: { holder: 'CM' },
        durationMs: 900,
      },
      {
        caption: 'CM slides a through ball and the striker runs onto it.',
        move: { ST: { x: 30, y: 14 } },
        ball: { holder: 'ST' },
        durationMs: 1000,
      },
      {
        caption: 'Shot on goal.',
        move: { ST: { x: 32, y: 12 } },
        ball: { point: { x: 47, y: 2.5 } },
        durationMs: 500,
      },
    ],
  },
] as const satisfies readonly Drill[])

export function getDrill(id: string | undefined): Drill | undefined {
  return DRILLS.find((drill) => drill.id === id)
}

function ballPoint(ball: BallState, positions: Readonly<Record<SlotId, PitchPoint>>): PitchPoint {
  if ('point' in ball) return ball.point
  const holder = positions[ball.holder]
  return { x: holder.x + BALL_OFFSET.x, y: holder.y + BALL_OFFSET.y }
}

/** Expands cumulative step moves into full frames the player can render. */
export function resolveDrillFrames(drill: Drill): readonly DrillFrame[] {
  const frames: DrillFrame[] = []
  let positions: Readonly<Record<SlotId, PitchPoint>> = drill.start
  for (const step of drill.steps) {
    positions = step.move ? { ...positions, ...step.move } : positions
    frames.push({
      caption: step.caption,
      positions,
      ball: ballPoint(step.ball, positions),
      ballHolder: 'holder' in step.ball ? step.ball.holder : undefined,
      durationMs: step.durationMs,
    })
  }
  return frames
}
