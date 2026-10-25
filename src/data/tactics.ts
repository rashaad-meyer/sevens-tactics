import { FORMATION_231 } from './formation'
import type { SlotId } from './types'

export type TacticId = 'attack' | 'defend-1' | 'defend-2'

export interface PitchPoint {
  readonly x: number
  readonly y: number
}

export interface Tactic {
  readonly id: TacticId
  readonly name: string
  /** Shape as seen from the back, e.g. "2-3-1". */
  readonly shape: string
  readonly description: string
  /** Where each slot stands in this shape, in pitch units. */
  readonly positions: Readonly<Record<SlotId, PitchPoint>>
}

const ATTACK_POSITIONS = Object.fromEntries(
  FORMATION_231.map((slot) => [slot.slotId, { x: slot.x, y: slot.y }]),
) as Record<SlotId, PitchPoint>

/**
 * Shapes the same seven slots move into. Markers keep their slot identity so
 * the UI can animate players between tactics.
 */
export const TACTICS: readonly Tactic[] = Object.freeze([
  {
    id: 'attack',
    name: 'Attack',
    shape: '2-3-1',
    description: 'Standard shape. Two at the back, three across midfield, one up top.',
    positions: ATTACK_POSITIONS,
  },
  {
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
] as const satisfies readonly Tactic[])

const firstTactic = TACTICS[0]
if (!firstTactic) {
  throw new Error('TACTICS must contain at least one tactic')
}
export const DEFAULT_TACTIC: Tactic = firstTactic

export function getTactic(id: string | undefined): Tactic | undefined {
  return TACTICS.find((tactic) => tactic.id === id)
}

export function formatTacticLabel(tactic: Pick<Tactic, 'name' | 'shape'>): string {
  return `${tactic.name} · ${tactic.shape}`
}

export interface TacticOption {
  readonly value: TacticId
  readonly label: string
}

export function getTacticOptions(): readonly TacticOption[] {
  return TACTICS.map((tactic) => ({ value: tactic.id, label: formatTacticLabel(tactic) }))
}
