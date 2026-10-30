import { describe, expect, it } from 'vitest'
import { FORMATION_231 } from '../formation'
import { getPlayer, SQUAD } from '../players'
import { countGirlsOnPitch, getBench, getHalvesPlayed, getLineupPlacements } from '../selectors'
import { MIN_GIRLS_ON_PITCH, TEAM_SHEETS } from '../teamSheets'
import type { SheetKey, SlotId } from '../types'

/** Bench lists from the corrected reference HTML, with later edits and James's withdrawal applied. */
const EXPECTED_BENCH: Record<SheetKey, string[]> = {
  g1h1: ['Hannah', 'Laura', 'Maria', 'Declan', 'Alex', 'Tumelo'],
  g1h2: ['Cass', 'Laurie Ann', 'Josh', 'Adam', 'Angelo', 'Rashaad'],
  g2h1: ['Hannah', 'Laura', 'Laurie Ann', 'Declan', 'Alex', 'Tumelo'],
  g2h2: ['Cass', 'Laurie Ann', 'Maria', 'Josh', 'Angelo', 'Alex'],
  g3h1: ['Hannah', 'Laura', 'Declan', 'Adam', 'Tumelo', 'Rashaad'],
  g3h2: ['Cass', 'Laurie Ann', 'Maria', 'Josh', 'Alex', 'Adam'],
  g4h1: ['Hannah', 'Laura', 'Maria', 'Adam', 'Angelo', 'Tumelo'],
  g4h2: ['Cass', 'Hannah', 'Maria', 'Josh', 'Declan', 'Angelo'],
}

const GIRL_SLOTS: readonly SlotId[] = ['ST', 'LM', 'RM']

describe('team sheet data integrity', () => {
  it('has eight sheets in game/half order', () => {
    expect(TEAM_SHEETS.map((s) => s.key)).toEqual([
      'g1h1', 'g1h2', 'g2h1', 'g2h2', 'g3h1', 'g3h2', 'g4h1', 'g4h2',
    ])
  })

  it.each(TEAM_SHEETS)('$key fills every slot with a unique known player', (sheet) => {
    const ids = Object.values(sheet.lineup)
    expect(ids).toHaveLength(FORMATION_231.length)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(() => getPlayer(id)).not.toThrow()
  })

  it.each(TEAM_SHEETS)('$key has at least two girls, only at ST/LM/RM', (sheet) => {
    expect(countGirlsOnPitch(sheet)).toBeGreaterThanOrEqual(MIN_GIRLS_ON_PITCH)
    for (const [slot, id] of Object.entries(sheet.lineup) as [SlotId, typeof sheet.lineup.ST][]) {
      if (getPlayer(id).gender === 'f') expect(GIRL_SLOTS).toContain(slot)
    }
  })

  it.each(TEAM_SHEETS)('$key bench matches the reference sheet', (sheet) => {
    // The reference lists benches in varying order; we always use squad order.
    const names = getBench(sheet).map((p) => p.name)
    expect([...names].sort()).toEqual([...EXPECTED_BENCH[sheet.key]].sort())
  })

  it('lists the bench in squad order', () => {
    expect(getBench(TEAM_SHEETS[0]!).map((p) => p.name)).toEqual(EXPECTED_BENCH.g1h1)
  })

  it.each(TEAM_SHEETS)('$key pitch plus bench is the full squad', (sheet) => {
    const all = [...Object.values(sheet.lineup), ...getBench(sheet).map((p) => p.id)].sort()
    expect(all).toEqual(SQUAD.map((p) => p.id).sort())
  })

  it('carries the later line-up edits and the G1H2/G4H2 swap', () => {
    const g4h2 = TEAM_SHEETS.find((s) => s.key === 'g4h2')!.lineup
    expect(g4h2).toMatchObject({ ST: 'adam', LM: 'laura', RM: 'laurie-ann' })
    const g1h2 = TEAM_SHEETS.find((s) => s.key === 'g1h2')!.lineup
    expect(g1h2).toMatchObject({ ST: 'laura', LM: 'maria', CM: 'tumelo', RM: 'hannah', LCB: 'declan', RCB: 'alex' })
    const g3h2 = TEAM_SHEETS.find((s) => s.key === 'g3h2')!.lineup
    expect(g3h2).toMatchObject({ ST: 'rashaad', LM: 'hannah', RM: 'laura' })
    expect(TEAM_SHEETS[0]!.lineup.RM).toBe('laurie-ann')
  })

  it("hands James's four halves to Jayden, Angelo, Declan and Alex", () => {
    const lineup = (key: SheetKey) => TEAM_SHEETS.find((s) => s.key === key)!.lineup
    expect(lineup('g2h2')).toMatchObject({ GK: 'rashaad', RCB: 'jayden', LCB: 'declan' })
    expect(lineup('g3h2')).toMatchObject({ CM: 'angelo' })
    expect(lineup('g4h1')).toMatchObject({ CM: 'declan' })
    expect(lineup('g4h2')).toMatchObject({ CM: 'rashaad', LCB: 'tumelo', RCB: 'alex' })
    expect(SQUAD.some((p) => p.name === 'James')).toBe(false)
  })

  it('Jayden keeps goal except in Game 2, when Rashaad does; Declan never does', () => {
    for (const sheet of TEAM_SHEETS) {
      expect(sheet.lineup.GK).toBe(sheet.game === 2 ? 'rashaad' : 'jayden')
    }
  })
})

describe('getLineupPlacements', () => {
  it('returns one placement per formation slot with the slot coordinates', () => {
    const placements = getLineupPlacements(TEAM_SHEETS[0]!)
    expect(placements.map((p) => p.slotId)).toEqual(FORMATION_231.map((s) => s.slotId))
    expect(placements[0]).toMatchObject({ slotId: 'ST', x: 50, y: 30 })
    expect(placements[0]!.player.name).toBe('Adam')
  })

  it('assigns the gk variant by slot, not by player', () => {
    const g2h1 = TEAM_SHEETS.find((s) => s.key === 'g2h1')!
    const byName = Object.fromEntries(
      getLineupPlacements(g2h1).map((p) => [p.player.name, p.variant]),
    )
    expect(byName['Rashaad']).toBe('gk')
    expect(byName['Jayden']).toBe('boy')
    expect(byName['Declan']).toBeUndefined()
    expect(byName['Maria']).toBe('girl')
    expect(byName['Adam']).toBe('boy')
  })
})

describe('getHalvesPlayed', () => {
  it("matches the reference summary tables after the G1H1 edit and James's withdrawal", () => {
    const table = Object.fromEntries(
      getHalvesPlayed().map((h) => [h.player.name, [h.outfield, h.inGoal]]),
    )
    expect(table).toEqual({
      Cass: [4, 0],
      Hannah: [3, 0],
      Laura: [4, 0],
      'Laurie Ann': [4, 0],
      Maria: [3, 0],
      Josh: [4, 0],
      Rashaad: [4, 2],
      Adam: [4, 0],
      Tumelo: [4, 0],
      Alex: [4, 0],
      Angelo: [4, 0],
      Declan: [4, 0],
      Jayden: [2, 6],
    })
  })
})
