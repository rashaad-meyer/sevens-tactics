import type { FormationSlot } from './types'

/** Portrait pitch coordinate space. Our team attacks towards the top. */
export const PITCH_VIEWBOX = Object.freeze({ width: 100, height: 150 })

/**
 * 2-3-1 plus goalkeeper. Coordinates are in viewBox units so the same slots
 * can later be animated for the tactics pages.
 */
export const FORMATION_231: readonly FormationSlot[] = Object.freeze([
  { slotId: 'ST', position: 'ST', label: 'Striker', x: 50, y: 30 },
  { slotId: 'LM', position: 'LM', label: 'Left midfield', x: 20, y: 64 },
  { slotId: 'CM', position: 'CM', label: 'Centre midfield', x: 50, y: 74 },
  { slotId: 'RM', position: 'RM', label: 'Right midfield', x: 80, y: 64 },
  { slotId: 'LCB', position: 'DEF', label: 'Left defender', x: 31, y: 105 },
  { slotId: 'RCB', position: 'DEF', label: 'Right defender', x: 69, y: 105 },
  { slotId: 'GK', position: 'GK', label: 'Goalkeeper', x: 50, y: 130 },
] as const satisfies readonly FormationSlot[])
