import type { TeamSheet } from './types'

/** Transcribed from docs/reference/mixed-7s-team-sheets.html. */
export const TEAM_SHEETS: readonly TeamSheet[] = Object.freeze([
  {
    key: 'g1h1',
    game: 1,
    half: 1,
    lineup: {
      ST: 'hannah',
      LM: 'laura',
      CM: 'rashaad',
      RM: 'maria',
      LCB: 'josh',
      RCB: 'declan',
      GK: 'jayden',
    },
  },
  {
    key: 'g1h2',
    game: 1,
    half: 2,
    lineup: {
      ST: 'cass',
      LM: 'laura',
      CM: 'james',
      RM: 'laurie-ann',
      LCB: 'adam',
      RCB: 'alex',
      GK: 'jayden',
    },
  },
  {
    key: 'g2h1',
    game: 2,
    half: 1,
    lineup: {
      ST: 'laurie-ann',
      LM: 'hannah',
      CM: 'angelo',
      RM: 'maria',
      LCB: 'josh',
      RCB: 'tumelo',
      GK: 'jayden',
    },
  },
  {
    key: 'g2h2',
    game: 2,
    half: 2,
    lineup: {
      ST: 'laura',
      LM: 'cass',
      CM: 'rashaad',
      RM: 'hannah',
      LCB: 'alex',
      RCB: 'declan',
      GK: 'jayden',
    },
  },
  {
    key: 'g3h1',
    game: 3,
    half: 1,
    lineup: {
      ST: 'maria',
      LM: 'cass',
      CM: 'tumelo',
      RM: 'laurie-ann',
      LCB: 'adam',
      RCB: 'alex',
      GK: 'jayden',
    },
  },
  {
    key: 'g3h2',
    game: 3,
    half: 2,
    lineup: {
      ST: 'hannah',
      LM: 'laura',
      CM: 'rashaad',
      RM: 'laurie-ann',
      LCB: 'josh',
      RCB: 'james',
      GK: 'jayden',
    },
  },
  {
    key: 'g4h1',
    game: 4,
    half: 1,
    lineup: {
      ST: 'cass',
      LM: 'laura',
      CM: 'tumelo',
      RM: 'maria',
      LCB: 'angelo',
      RCB: 'james',
      GK: 'jayden',
    },
  },
  {
    key: 'g4h2',
    game: 4,
    half: 2,
    lineup: {
      ST: 'laurie-ann',
      LM: 'cass',
      CM: 'angelo',
      RM: 'hannah',
      LCB: 'jayden',
      RCB: 'adam',
      GK: 'declan',
    },
  },
] as const satisfies readonly TeamSheet[])

const firstSheet = TEAM_SHEETS[0]
if (!firstSheet) {
  throw new Error('TEAM_SHEETS must contain at least one sheet')
}
/** Fallback sheet for the root route and for invalid URLs. */
export const DEFAULT_SHEET: TeamSheet = firstSheet

export const SELECTION_RULES: readonly string[] = Object.freeze([
  'Girls play wide midfield or striker only.',
  'Josh, Jayden and Declan play at defender.',
  'Rashaad, James, Angelo and Tumelo rotate central midfield.',
  'Jayden keeps goal in every half except Game 4 2nd half, when Declan takes over and Jayden plays at defender.',
])
