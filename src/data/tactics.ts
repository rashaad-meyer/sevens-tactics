import { DRILLS, type Drill, type DrillId } from './drills'
import { FORMATION_231 } from './formation'
import type { PitchPoint, SlotId } from './types'

export type ShapeId = 'attack' | 'defend-1' | 'defend-2'
export type TacticId = ShapeId | DrillId

export interface ShapeTactic {
  readonly kind: 'shape'
  readonly id: ShapeId
  readonly name: string
  /** Shape as seen from the back, e.g. "2-3-1". */
  readonly shape: string
  readonly description: string
  /** Where each slot stands in this shape, in pitch units. */
  readonly positions: Readonly<Record<SlotId, PitchPoint>>
}

export type Tactic = ShapeTactic | Drill

const ATTACK_POSITIONS = Object.fromEntries(
  FORMATION_231.map((slot) => [slot.slotId, { x: slot.x, y: slot.y }]),
) as Record<SlotId, PitchPoint>

/**
 * Static shapes the same seven slots move into. Markers keep their slot
 * identity so the UI can animate players between tactics.
 */
export const SHAPES: readonly ShapeTactic[] = Object.freeze([
  {
    kind: 'shape',
    id: 'attack',
    name: 'Attack',
    shape: '2-3-1',
    description: 'Standard shape. Two at the back, three across midfield, one up top.',
    positions: ATTACK_POSITIONS,
  },
  {
    kind: 'shape',
    id: 'defend-1',
    name: 'Defend 1',
    shape: '4-2-0',
    description: 'LM and RM drop in to make a back four. The striker drops alongside the CM.',
    positions: {
      LM: { x: 15, y: 104 },
      LCB: { x: 38, y: 109 },
      RCB: { x: 62, y: 109 },
      RM: { x: 85, y: 104 },
      ST: { x: 36, y: 76 },
      CM: { x: 64, y: 76 },
      GK: { x: 50, y: 130 },
    },
  },
  {
    kind: 'shape',
    id: 'defend-2',
    name: 'Defend 2',
    shape: '3-3-0',
    description: 'CM drops in to make a back three. The striker drops into midfield.',
    positions: {
      LCB: { x: 27, y: 107 },
      CM: { x: 50, y: 111 },
      RCB: { x: 73, y: 107 },
      LM: { x: 20, y: 76 },
      ST: { x: 50, y: 72 },
      RM: { x: 80, y: 76 },
      GK: { x: 50, y: 130 },
    },
  },
] as const satisfies readonly ShapeTactic[])

export const TACTICS: readonly Tactic[] = Object.freeze([...SHAPES, ...DRILLS])

const firstTactic = TACTICS[0]
if (!firstTactic) {
  throw new Error('TACTICS must contain at least one tactic')
}
export const DEFAULT_TACTIC: Tactic = firstTactic

export function getTactic(id: string | undefined): Tactic | undefined {
  return TACTICS.find((tactic) => tactic.id === id)
}

export function formatTacticLabel(tactic: Tactic): string {
  return tactic.kind === 'shape' ? `${tactic.name} · ${tactic.shape}` : tactic.name
}

export interface TacticOption {
  readonly value: TacticId
  readonly label: string
}

export interface TacticOptionGroup {
  readonly label: string
  readonly options: readonly TacticOption[]
}

function toOption(tactic: Tactic): TacticOption {
  return { value: tactic.id, label: formatTacticLabel(tactic) }
}

export function getTacticOptions(): readonly TacticOption[] {
  return TACTICS.map(toOption)
}

export function getTacticOptionGroups(): readonly TacticOptionGroup[] {
  return [
    { label: 'Shapes', options: SHAPES.map(toOption) },
    { label: 'Patterns', options: DRILLS.map(toOption) },
  ]
}
