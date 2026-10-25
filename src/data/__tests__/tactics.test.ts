import { describe, expect, it } from 'vitest'
import { FORMATION_231, PITCH_VIEWBOX } from '../formation'
import {
  DEFAULT_TACTIC,
  formatTacticLabel,
  getTactic,
  getTacticOptionGroups,
  getTacticOptions,
  SHAPES,
  TACTICS,
  type ShapeTactic,
} from '../tactics'
import type { SlotId } from '../types'

const SLOTS: readonly SlotId[] = FORMATION_231.map((s) => s.slotId)

function shape(id: string): ShapeTactic {
  const tactic = getTactic(id)
  if (!tactic || tactic.kind !== 'shape') throw new Error(`${id} is not a shape`)
  return tactic
}

describe('tactics', () => {
  it('offers the three shapes and the patterns with Attack as default', () => {
    expect(getTacticOptions()).toEqual([
      { value: 'attack', label: 'Attack · 2-3-1' },
      { value: 'defend-1', label: 'Defend 1 · 4-2-0' },
      { value: 'defend-2', label: 'Defend 2 · 3-3-0' },
      { value: 'attacking-1', label: 'Attacking Pattern 1' },
      { value: 'attacking-2', label: 'Attacking Pattern 2' },
    ])
    expect(getTacticOptionGroups().map((g) => [g.label, g.options.length])).toEqual([
      ['Shapes', 3],
      ['Patterns', 2],
    ])
    expect(DEFAULT_TACTIC.id).toBe('attack')
    expect(formatTacticLabel(DEFAULT_TACTIC)).toBe('Attack · 2-3-1')
  })

  it.each(SHAPES)('$id positions every slot inside the pitch', (tactic) => {
    expect(Object.keys(tactic.positions).sort()).toEqual([...SLOTS].sort())
    for (const slot of SLOTS) {
      const { x, y } = tactic.positions[slot]
      expect(x).toBeGreaterThan(8)
      expect(x).toBeLessThan(PITCH_VIEWBOX.width - 8)
      expect(y).toBeGreaterThan(8)
      expect(y).toBeLessThan(PITCH_VIEWBOX.height - 8)
    }
  })

  it('attack matches the 2-3-1 formation used on the team sheets', () => {
    for (const slot of FORMATION_231) {
      expect(shape('attack').positions[slot.slotId]).toEqual({ x: slot.x, y: slot.y })
    }
  })

  it('defend 1 is a back four with LM and RM dropped in and ST beside CM', () => {
    const p = shape('defend-1').positions
    for (const point of [p.LM, p.LCB, p.RCB, p.RM]) expect(point.y).toBeGreaterThan(100)
    expect(p.LM.x).toBeLessThan(p.LCB.x)
    expect(p.RM.x).toBeGreaterThan(p.RCB.x)
    expect(Math.abs(p.ST.y - p.CM.y)).toBeLessThan(2)
    expect(p.ST.y).toBeLessThan(p.LCB.y)
  })

  it('defend 2 is a back three with CM dropped in and ST in midfield', () => {
    const p = shape('defend-2').positions
    for (const point of [p.LCB, p.CM, p.RCB]) expect(point.y).toBeGreaterThan(100)
    expect(p.CM.x).toBeGreaterThan(p.LCB.x)
    expect(p.CM.x).toBeLessThan(p.RCB.x)
    for (const point of [p.LM, p.ST, p.RM]) {
      expect(point.y).toBeGreaterThan(60)
      expect(point.y).toBeLessThan(90)
    }
  })

  it('keeps the goalkeeper in goal in every shape', () => {
    for (const tactic of SHAPES) expect(tactic.positions.GK).toEqual({ x: 50, y: 130 })
  })

  it('returns undefined for unknown ids and is frozen', () => {
    expect(getTactic('park-the-bus')).toBeUndefined()
    expect(getTactic(undefined)).toBeUndefined()
    expect(Object.isFrozen(TACTICS)).toBe(true)
    expect(getTactic('attacking-1')?.kind).toBe('drill')
  })
})
