import { FORMATION_231 } from './formation'
import type { PitchPoint, SlotId } from './types'

export type DrillId = 'attacking-1' | 'attacking-2'

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

/** Build-up start: both defenders split to the corners of the box. */
const BUILD_UP_START: Readonly<Record<SlotId, PitchPoint>> = {
  ...ATTACK_START,
  LCB: { x: 27, y: 123 },
  RCB: { x: 73, y: 123 },
}

export const DRILLS: readonly Drill[] = Object.freeze([
  {
    kind: 'drill',
    id: 'attacking-1',
    name: 'Attacking Pattern 1',
    description:
      'Build down the left: GK to the defender, into the dropping wide midfielder, inside to the CM, through ball for the striker.',
    start: BUILD_UP_START,
    steps: [
      {
        caption: 'Set up. GK has the ball and both defenders take the corners of the box.',
        ball: { holder: 'GK' },
        durationMs: 0,
      },
      {
        caption: 'GK plays it out to the defender.',
        ball: { holder: 'LCB' },
        durationMs: 600,
      },
      {
        caption: 'The left midfielder drops a little to show for the ball.',
        move: { LM: { x: 19, y: 86 } },
        ball: { holder: 'LCB' },
        durationMs: 700,
      },
      {
        caption: 'Defender passes up the line to the left midfielder.',
        ball: { holder: 'LM' },
        durationMs: 600,
      },
      {
        caption: 'The CM drifts wide into the space the midfielder has left.',
        move: { CM: { x: 33, y: 62 } },
        ball: { holder: 'LM' },
        durationMs: 700,
      },
      {
        caption: 'Left midfielder lays it inside to the CM.',
        ball: { holder: 'CM' },
        durationMs: 600,
      },
      {
        caption: 'CM slides a through ball in behind and the striker runs onto it.',
        move: { ST: { x: 46, y: 14 } },
        ball: { holder: 'ST' },
        durationMs: 800,
      },
      {
        caption: 'Shot on goal.',
        move: { ST: { x: 47, y: 12 } },
        ball: { point: { x: 51, y: 2.5 } },
        durationMs: 450,
      },
    ],
  },
  {
    kind: 'drill',
    id: 'attacking-2',
    name: 'Attacking Pattern 2',
    description:
      'Through the middle then wide: GK to the CM, through ball for the wide midfielder, cross into three runners.',
    start: BUILD_UP_START,
    steps: [
      {
        caption: 'Set up. GK has the ball and both defenders take the corners of the box.',
        ball: { holder: 'GK' },
        durationMs: 0,
      },
      {
        caption: 'The CM comes in close to receive.',
        move: { CM: { x: 50, y: 102 } },
        ball: { holder: 'GK' },
        durationMs: 700,
      },
      {
        caption: 'GK plays it into the CM.',
        ball: { holder: 'CM' },
        durationMs: 600,
      },
      {
        caption: 'The left midfielder makes a run up the line.',
        move: { LM: { x: 14, y: 40 } },
        ball: { holder: 'CM' },
        durationMs: 800,
      },
      {
        caption: 'CM plays a through ball up the line.',
        move: { LM: { x: 12, y: 28 } },
        ball: { holder: 'LM' },
        durationMs: 800,
      },
      {
        caption: 'Left midfielder takes it up the side. ST, CM and RM run into the box.',
        move: {
          LM: { x: 10, y: 12 },
          ST: { x: 35, y: 10 },
          CM: { x: 50, y: 18 },
          RM: { x: 65, y: 10 },
        },
        ball: { holder: 'LM' },
        durationMs: 900,
      },
      {
        caption: 'Ball into the box: ST front post, CM middle, RM back post. The CM meets it.',
        ball: { holder: 'CM' },
        durationMs: 600,
      },
      {
        caption: 'Goal.',
        move: { CM: { x: 50, y: 14 } },
        ball: { point: { x: 50, y: 2.5 } },
        durationMs: 400,
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
