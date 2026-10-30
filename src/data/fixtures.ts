import type { GameNumber, HalfNumber } from './types'

export interface Fixture {
  readonly game: GameNumber
  /** Kick-off as 24-hour "HH:MM". */
  readonly kickoff: string
  readonly opponent: string
}

/** Each half is 15 minutes and the halves run back to back, so a game is 30 minutes. */
export const HALF_MINUTES = 15

export const FIXTURES: readonly Fixture[] = Object.freeze([
  { game: 1, kickoff: '09:00', opponent: 'Evol FC' },
  { game: 2, kickoff: '10:00', opponent: 'ASSassins FC' },
  { game: 3, kickoff: '11:00', opponent: 'The Lions Leftovers' },
  { game: 4, kickoff: '12:00', opponent: 'Burango FC' },
] as const satisfies readonly Fixture[])

export function getFixture(game: GameNumber): Fixture {
  const fixture = FIXTURES.find((f) => f.game === game)
  if (!fixture) {
    throw new Error(`No fixture for game ${game}`)
  }
  return fixture
}

function toMinutes(hhmm: string): number {
  const [hours = 0, minutes = 0] = hhmm.split(':').map(Number)
  return hours * 60 + minutes
}

/** "9:15" style, without a leading zero, as the schedule is read aloud pitch-side. */
export function formatClock(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  return `${hours}:${String(minutes).padStart(2, '0')}`
}

export function kickoffTime(game: GameNumber): string {
  return formatClock(toMinutes(getFixture(game).kickoff))
}

export function halfStartTime(game: GameNumber, half: HalfNumber): string {
  return formatClock(toMinutes(getFixture(game).kickoff) + (half - 1) * HALF_MINUTES)
}

export function fullTime(game: GameNumber): string {
  return formatClock(toMinutes(getFixture(game).kickoff) + 2 * HALF_MINUTES)
}
