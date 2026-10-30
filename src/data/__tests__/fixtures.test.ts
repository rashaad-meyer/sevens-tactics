import { describe, expect, it } from 'vitest'
import { FIXTURES, fullTime, getFixture, halfStartTime, kickoffTime } from '../fixtures'

describe('fixtures', () => {
  it('lists the four games in order with their opponents', () => {
    expect(FIXTURES.map((f) => [f.game, f.opponent])).toEqual([
      [1, 'Evol FC'],
      [2, 'ASSassins FC'],
      [3, 'The Lions Leftovers'],
      [4, 'Burango FC'],
    ])
    expect(getFixture(3).kickoff).toBe('11:00')
  })

  it('kicks off on the hour from 9 to 12', () => {
    expect([1, 2, 3, 4].map((g) => kickoffTime(g as 1 | 2 | 3 | 4))).toEqual(['9:00', '10:00', '11:00', '12:00'])
  })

  it('starts the second half at quarter past and finishes at half past', () => {
    expect(halfStartTime(1, 1)).toBe('9:00')
    expect(halfStartTime(1, 2)).toBe('9:15')
    expect(halfStartTime(4, 2)).toBe('12:15')
    expect(fullTime(2)).toBe('10:30')
  })
})
