import { describe, expect, it } from 'vitest'
import { FORMATION_231 } from '../formation'
import { getPlayer, SQUAD } from '../players'
import { countGirlsOnPitch, getBench, getHalvesPlayed, getLineupPlacements } from '../selectors'
import { TEAM_SHEETS } from '../teamSheets'
import type { SheetKey } from '../types'

/** Bench lists copied verbatim from the reference HTML, in order. */
const EXPECTED_BENCH: Record<SheetKey, string[]> = {
  g1h1: ['Cass', 'Laurie Ann', 'Adam', 'Alex', 'Angelo', 'Tumelo', 'James'],
  g1h2: ['Hannah', 'Maria', 'Josh', 'Declan', 'Rashaad', 'Angelo', 'Tumelo'],
  g2h1: ['Cass', 'Laura', 'Declan', 'Adam', 'Alex', 'Rashaad', 'James'],
  g2h2: ['Maria', 'Laurie Ann', 'Josh', 'Adam', 'Angelo', 'Tumelo', 'James'],
  g3h1: ['Hannah', 'Laura', 'Josh', 'Declan', 'Rashaad', 'Angelo', 'James'],
  g3h2: ['Cass', 'Maria', 'Declan', 'Adam', 'Alex', 'Angelo', 'Tumelo'],
  g4h1: ['Hannah', 'Laurie Ann', 'Josh', 'Declan', 'Adam', 'Alex', 'Rashaad'],
  g4h2: ['Laura', 'Maria', 'Josh', 'Alex', 'Rashaad', 'Tumelo', 'James'],
}

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

  it.each(TEAM_SHEETS)('$key has at least three girls, all in ST/LM/RM', (sheet) => {
    expect(countGirlsOnPitch(sheet)).toBeGreaterThanOrEqual(3)
    for (const slot of ['ST', 'LM', 'RM'] as const) {
      expect(getPlayer(sheet.lineup[slot]).gender).toBe('f')
    }
  })

  it.each(TEAM_SHEETS)('$key bench matches the reference sheet', (sheet) => {
    // The reference lists g2h2 as "Maria, Laurie Ann"; we always use squad order.
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
})

describe('getLineupPlacements', () => {
  it('returns one placement per formation slot with the slot coordinates', () => {
    const placements = getLineupPlacements(TEAM_SHEETS[0]!)
    expect(placements.map((p) => p.slotId)).toEqual(FORMATION_231.map((s) => s.slotId))
    expect(placements[0]).toMatchObject({ slotId: 'ST', x: 50, y: 30 })
    expect(placements[0]!.player.name).toBe('Hannah')
  })

  it('assigns the gk variant by slot, not by player', () => {
    const g4h2 = TEAM_SHEETS.find((s) => s.key === 'g4h2')!
    const byName = Object.fromEntries(
      getLineupPlacements(g4h2).map((p) => [p.player.name, p.variant]),
    )
    expect(byName['Declan']).toBe('gk')
    expect(byName['Jayden']).toBe('boy')
    expect(byName['Cass']).toBe('girl')
  })
})

describe('getHalvesPlayed', () => {
  it('matches the reference summary tables', () => {
    const table = Object.fromEntries(
      getHalvesPlayed().map((h) => [h.player.name, [h.outfield, h.inGoal]]),
    )
    expect(table).toEqual({
      Cass: [5, 0],
      Hannah: [5, 0],
      Laura: [5, 0],
      'Laurie Ann': [5, 0],
      Maria: [4, 0],
      Josh: [3, 0],
      Adam: [3, 0],
      Alex: [3, 0],
      Angelo: [3, 0],
      Tumelo: [3, 0],
      Rashaad: [3, 0],
      James: [3, 0],
      Declan: [2, 1],
      Jayden: [1, 7],
    })
  })
})
