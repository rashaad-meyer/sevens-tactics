import { useCallback } from 'react'
import { useMatch, useNavigate } from 'react-router'
import { DEFAULT_TACTIC, getTactic, type Tactic, type TacticId } from '../data/tactics'

export const TACTICS_ROUTE = '/tactics/:tactic'

export function tacticPath(id: TacticId): string {
  return `/tactics/${id}`
}

export interface SelectedTacticState {
  readonly onTacticsRoute: boolean
  readonly invalid: boolean
  readonly tactic: Tactic
  readonly selectTactic: (id: TacticId) => void
}

/** Reads the chosen tactic from the URL and exposes a way to change it. */
export function useSelectedTactic(): SelectedTacticState {
  const match = useMatch(TACTICS_ROUTE)
  const navigate = useNavigate()
  const matched = match ? getTactic(match.params.tactic) : undefined
  const tactic = matched ?? DEFAULT_TACTIC

  const selectTactic = useCallback(
    (id: TacticId) => {
      navigate(tacticPath(getTactic(id)?.id ?? DEFAULT_TACTIC.id))
    },
    [navigate],
  )

  return {
    onTacticsRoute: match !== null,
    invalid: match !== null && matched === undefined,
    tactic,
    selectTactic,
  }
}
