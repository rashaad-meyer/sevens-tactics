import type { Player, PlayerId } from './types'

/**
 * Squad in canonical order. This order is also the bench order used in the
 * original team sheets: girls alphabetically, then boys. James withdrew before
 * the tournament and is no longer in the squad.
 */
export const SQUAD: readonly Player[] = Object.freeze([
  { id: 'cass', name: 'Cass', gender: 'f' },
  { id: 'hannah', name: 'Hannah', gender: 'f' },
  { id: 'laura', name: 'Laura', gender: 'f' },
  { id: 'laurie-ann', name: 'Laurie Ann', shortName: 'LA', gender: 'f' },
  { id: 'maria', name: 'Maria', gender: 'f' },
  { id: 'josh', name: 'Josh', gender: 'm' },
  { id: 'declan', name: 'Declan', gender: 'm' },
  { id: 'adam', name: 'Adam', gender: 'm' },
  { id: 'alex', name: 'Alex', gender: 'm' },
  { id: 'rashaad', name: 'Rashaad', gender: 'm' },
  { id: 'angelo', name: 'Angelo', gender: 'm' },
  { id: 'tumelo', name: 'Tumelo', gender: 'm' },
  { id: 'jayden', name: 'Jayden', gender: 'm' },
] as const satisfies readonly Player[])

const PLAYER_INDEX: ReadonlyMap<PlayerId, Player> = new Map(
  SQUAD.map((player) => [player.id, player]),
)

export function getPlayer(id: PlayerId): Player {
  const player = PLAYER_INDEX.get(id)
  if (!player) {
    throw new Error(`Unknown player id: ${id}`)
  }
  return player
}

export function displayName(player: Player): string {
  return player.shortName ?? player.name
}
