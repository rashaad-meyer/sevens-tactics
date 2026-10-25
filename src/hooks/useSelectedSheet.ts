import { useCallback } from 'react'
import { useMatch, useNavigate } from 'react-router'
import { getAdjacentSheet, getSheet, parseSheetParams } from '../data/selectors'
import { DEFAULT_SHEET } from '../data/teamSheets'
import type { SheetKey, TeamSheet } from '../data/types'

export const SHEET_ROUTE = '/sheet/:game/:half'

export function sheetPath(sheet: Pick<TeamSheet, 'game' | 'half'>): string {
  return `/sheet/${sheet.game}/${sheet.half}`
}

export function sheetPathForKey(key: SheetKey): string {
  return sheetPath(getSheet(key) ?? DEFAULT_SHEET)
}

export interface SelectedSheetState {
  /** Whether the current URL is a team-sheet route at all. */
  readonly onSheetRoute: boolean
  /** True when the route params did not resolve to a real sheet. */
  readonly invalid: boolean
  /** The resolved sheet, falling back to the default for non-sheet routes. */
  readonly sheet: TeamSheet
  readonly previous: TeamSheet | undefined
  readonly next: TeamSheet | undefined
  readonly selectSheet: (key: SheetKey) => void
}

/**
 * Reads the selected game/half from the URL (the source of truth) and exposes
 * navigation helpers. Works from any route so the header select can live in
 * the app shell.
 */
export function useSelectedSheet(): SelectedSheetState {
  const match = useMatch(SHEET_ROUTE)
  const navigate = useNavigate()

  const parsedKey = match ? parseSheetParams(match.params.game, match.params.half) : null
  const sheet = (parsedKey && getSheet(parsedKey)) || DEFAULT_SHEET

  const selectSheet = useCallback(
    (nextKey: SheetKey) => {
      navigate(sheetPathForKey(nextKey))
    },
    [navigate],
  )

  return {
    onSheetRoute: match !== null,
    invalid: match !== null && parsedKey === null,
    sheet,
    previous: getAdjacentSheet(sheet.key, -1),
    next: getAdjacentSheet(sheet.key, 1),
    selectSheet,
  }
}
