import { useCallback } from 'react'
import { useMatch, useNavigate, useSearchParams } from 'react-router'
import { DEFAULT_SIDE, parseSide, type Side } from '../data/mirror'
import { DEFAULT_TACTIC, getTactic, type Tactic, type TacticId } from '../data/tactics'

export const TACTICS_ROUTE = '/tactics/:tactic'
export const SIDE_PARAM = 'side'

export function tacticPath(id: TacticId, side: Side = DEFAULT_SIDE): string {
  const base = `/tactics/${id}`
  return side === DEFAULT_SIDE ? base : `${base}?${SIDE_PARAM}=${side}`
}

export interface SelectedTacticState {
  readonly onTacticsRoute: boolean
  readonly invalid: boolean
  readonly tactic: Tactic
  /** Which wing a pattern is played up. Shapes ignore this. */
  readonly side: Side
  readonly selectTactic: (id: TacticId) => void
  readonly selectSide: (side: Side) => void
}

/** Reads the chosen tactic and side from the URL and exposes ways to change them. */
export function useSelectedTactic(): SelectedTacticState {
  const match = useMatch(TACTICS_ROUTE)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const matched = match ? getTactic(match.params.tactic) : undefined
  const tactic = matched ?? DEFAULT_TACTIC
  const side = parseSide(searchParams.get(SIDE_PARAM))

  const selectTactic = useCallback(
    (id: TacticId) => {
      navigate(tacticPath(getTactic(id)?.id ?? DEFAULT_TACTIC.id, side))
    },
    [navigate, side],
  )

  const selectSide = useCallback(
    (nextSide: Side) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          if (nextSide === DEFAULT_SIDE) next.delete(SIDE_PARAM)
          else next.set(SIDE_PARAM, nextSide)
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  return {
    onTacticsRoute: match !== null,
    invalid: match !== null && matched === undefined,
    tactic,
    side,
    selectTactic,
    selectSide,
  }
}
