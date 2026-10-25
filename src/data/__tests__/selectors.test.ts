import { describe, expect, it } from 'vitest'
import { displayName, getPlayer } from '../players'
import {
  formatAppearance,
  formatSheetLabel,
  getAppearances,
  getAdjacentSheet,
  getSheet,
  getSheetOptions,
  parseSheetParams,
  sheetKey,
} from '../selectors'
import { TEAM_SHEETS } from '../teamSheets'

describe('getSheetOptions', () => {
  it('labels every sheet as "Game N | Half M"', () => {
    const options = getSheetOptions()
    expect(options).toHaveLength(8)
    expect(options[0]).toEqual({ value: 'g1h1', label: 'Game 1 | Half 1' })
    expect(options[7]).toEqual({ value: 'g4h2', label: 'Game 4 | Half 2' })
  })

  it('formatSheetLabel matches the option label', () => {
    expect(formatSheetLabel({ game: 3, half: 2 })).toBe('Game 3 | Half 2')
  })
})

describe('parseSheetParams', () => {
  it.each([
    ['1', '1', 'g1h1'],
    ['4', '2', 'g4h2'],
    ['2', '1', 'g2h1'],
  ])('accepts game %s half %s', (game, half, expected) => {
    expect(parseSheetParams(game, half)).toBe(expected)
  })

  it.each([
    ['0', '1'],
    ['5', '1'],
    ['1', '3'],
    ['1', '0'],
    ['abc', '1'],
    ['1', 'x'],
    ['', '1'],
    [undefined, '1'],
    ['1', undefined],
    ['11', '1'],
    ['1.0', '1'],
    [' 1', '1'],
  ])('rejects game %s half %s', (game, half) => {
    expect(parseSheetParams(game, half)).toBeNull()
  })
})

describe('getSheet and getAdjacentSheet', () => {
  it('finds a sheet by key', () => {
    expect(getSheet(sheetKey(2, 2))?.lineup.ST).toBe('rashaad')
  })

  it('steps forward and backward through the sheets', () => {
    expect(getAdjacentSheet('g1h1', 1)?.key).toBe('g1h2')
    expect(getAdjacentSheet('g1h2', 1)?.key).toBe('g2h1')
    expect(getAdjacentSheet('g2h1', -1)?.key).toBe('g1h2')
  })

  it('returns undefined at the ends', () => {
    expect(getAdjacentSheet('g1h1', -1)).toBeUndefined()
    expect(getAdjacentSheet('g4h2', 1)).toBeUndefined()
  })

  it('does not mutate the source array', () => {
    const before = TEAM_SHEETS.map((s) => s.key)
    getAdjacentSheet('g1h1', 1)
    getSheetOptions()
    expect(TEAM_SHEETS.map((s) => s.key)).toEqual(before)
    expect(Object.isFrozen(TEAM_SHEETS)).toBe(true)
  })
})

describe('players', () => {
  it('uses the short name on the pitch for Laurie Ann only', () => {
    expect(displayName(getPlayer('laurie-ann'))).toBe('LA')
    expect(displayName(getPlayer('rashaad'))).toBe('Rashaad')
  })

  it('throws for an unknown id', () => {
    // @ts-expect-error deliberately invalid id
    expect(() => getPlayer('nobody')).toThrow(/Unknown player/)
  })
})

describe('getAppearances', () => {
  it('lists players alphabetically with their halves in playing order', () => {
    const rows = getAppearances()
    expect(rows.map((r) => r.player.name)).toEqual([
      'Adam', 'Alex', 'Angelo', 'Cass', 'Declan', 'Hannah', 'James',
      'Jayden', 'Josh', 'Laura', 'Laurie Ann', 'Maria', 'Rashaad', 'Tumelo',
    ])
    const adam = rows.find((r) => r.player.name === 'Adam')!
    expect(adam.appearances.map(formatAppearance)).toEqual(['1,1', '1,2', '2,1', '2,2'])
    const jayden = rows.find((r) => r.player.name === 'Jayden')!
    expect(jayden.appearances.map(formatAppearance)).toEqual([
      '1,1 GK', '1,2 GK', '2,1', '3,1 GK', '3,2 GK', '4,1 GK', '4,2 GK',
    ])
    const declan = rows.find((r) => r.player.name === 'Declan')!
    expect(declan.appearances.map(formatAppearance)).toEqual(['1,2', '2,1 GK', '2,2 GK', '3,2', '4,2'])
  })

  it('agrees with the halves-played totals', () => {
    for (const row of getAppearances()) {
      expect(row.appearances.length).toBeGreaterThan(0)
      expect(row.appearances.length).toBeLessThanOrEqual(8)
    }
    expect(getAppearances().reduce((n, r) => n + r.appearances.length, 0)).toBe(8 * 7)
  })
})
