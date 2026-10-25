import { FORMATION_231 } from './formation'
import { getPlayer, SQUAD } from './players'
import { DEFAULT_SHEET, TEAM_SHEETS } from './teamSheets'
import type {
  FormationSlot,
  GameNumber,
  HalfNumber,
  HalvesPlayed,
  MarkerVariant,
  Placement,
  Player,
  SheetKey,
  SheetOption,
  SlotId,
  TeamSheet,
} from './types'

const GAMES: readonly GameNumber[] = [1, 2, 3, 4]
const HALVES: readonly HalfNumber[] = [1, 2]

export const DEFAULT_SHEET_KEY: SheetKey = DEFAULT_SHEET.key

export function sheetKey(game: GameNumber, half: HalfNumber): SheetKey {
  return `g${game}h${half}`
}

export function getSheet(key: SheetKey): TeamSheet | undefined {
  return TEAM_SHEETS.find((sheet) => sheet.key === key)
}

export function getSheetIndex(key: SheetKey): number {
  return TEAM_SHEETS.findIndex((sheet) => sheet.key === key)
}

export function getAdjacentSheet(key: SheetKey, direction: -1 | 1): TeamSheet | undefined {
  const index = getSheetIndex(key)
  if (index === -1) return undefined
  return TEAM_SHEETS[index + direction]
}

export function formatSheetLabel(sheet: Pick<TeamSheet, 'game' | 'half'>): string {
  return `Game ${sheet.game} | Half ${sheet.half}`
}

export function getSheetOptions(): readonly SheetOption[] {
  return TEAM_SHEETS.map((sheet) => ({ value: sheet.key, label: formatSheetLabel(sheet) }))
}

function isGameNumber(value: number): value is GameNumber {
  return GAMES.includes(value as GameNumber)
}

function isHalfNumber(value: number): value is HalfNumber {
  return HALVES.includes(value as HalfNumber)
}

/** Validates untrusted URL params and returns a sheet key, or null. */
export function parseSheetParams(
  game: string | undefined,
  half: string | undefined,
): SheetKey | null {
  if (!game || !half || !/^\d$/.test(game) || !/^\d$/.test(half)) return null
  const gameNumber = Number(game)
  const halfNumber = Number(half)
  if (!isGameNumber(gameNumber) || !isHalfNumber(halfNumber)) return null
  const key = sheetKey(gameNumber, halfNumber)
  return getSheet(key) ? key : null
}

export function markerVariant(slot: Pick<FormationSlot, 'position'>, player: Player): MarkerVariant {
  if (slot.position === 'GK') return 'gk'
  return player.gender === 'f' ? 'girl' : 'boy'
}

export function getLineupPlacements(
  sheet: TeamSheet,
  formation: readonly FormationSlot[] = FORMATION_231,
): readonly Placement[] {
  return formation.map((slot) => {
    const player = getPlayer(sheet.lineup[slot.slotId])
    return { ...slot, player, variant: markerVariant(slot, player) }
  })
}

export function getBench(sheet: TeamSheet): readonly Player[] {
  const onPitch = new Set(Object.values(sheet.lineup))
  return SQUAD.filter((player) => !onPitch.has(player.id))
}

export function countGirlsOnPitch(sheet: TeamSheet): number {
  return Object.values(sheet.lineup).filter((id) => getPlayer(id).gender === 'f').length
}

const GK_SLOT: SlotId = 'GK'

export function getHalvesPlayed(sheets: readonly TeamSheet[] = TEAM_SHEETS): readonly HalvesPlayed[] {
  return SQUAD.map((player) => {
    const appearances = sheets.flatMap((sheet) =>
      (Object.entries(sheet.lineup) as [SlotId, Player['id']][])
        .filter(([, id]) => id === player.id)
        .map(([slot]) => slot),
    )
    const inGoal = appearances.filter((slot) => slot === GK_SLOT).length
    return { player, outfield: appearances.length - inGoal, inGoal }
  })
}
