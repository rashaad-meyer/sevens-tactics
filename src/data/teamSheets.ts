import type { TeamSheet } from './types'

/**
 * Transcribed from docs/reference/mixed-7s-team-sheets.html (corrected sheets),
 * with later edits: G1H2 Adam ST / James CM / Tumelo DEF; G3H2 Rashaad ST / James CM;
 * then the whole G1H2 and G4H2 sheets swapped.
 */
export const TEAM_SHEETS: readonly TeamSheet[] = Object.freeze([
  {
    key: 'g1h1',
    game: 1,
    half: 1,
    lineup: {
      ST: 'adam',
      LM: 'cass',
      CM: 'rashaad',
      RM: 'hannah',
      LCB: 'josh',
      RCB: 'angelo',
      GK: 'jayden',
    },
  },
  {
    key: 'g1h2',
    game: 1,
    half: 2,
    lineup: {
      ST: 'laura',
      LM: 'maria',
      CM: 'tumelo',
      RM: 'hannah',
      LCB: 'declan',
      RCB: 'alex',
      GK: 'jayden',
    },
  },
  {
    key: 'g2h1',
    game: 2,
    half: 1,
    lineup: {
      ST: 'adam',
      LM: 'maria',
      CM: 'angelo',
      RM: 'cass',
      LCB: 'josh',
      RCB: 'jayden',
      GK: 'declan',
    },
  },
  {
    key: 'g2h2',
    game: 2,
    half: 2,
    lineup: {
      ST: 'rashaad',
      LM: 'hannah',
      CM: 'james',
      RM: 'laura',
      LCB: 'tumelo',
      RCB: 'adam',
      GK: 'declan',
    },
  },
  {
    key: 'g3h1',
    game: 3,
    half: 1,
    lineup: {
      ST: 'cass',
      LM: 'laurie-ann',
      CM: 'angelo',
      RM: 'maria',
      LCB: 'josh',
      RCB: 'alex',
      GK: 'jayden',
    },
  },
  {
    key: 'g3h2',
    game: 3,
    half: 2,
    lineup: {
      ST: 'rashaad',
      LM: 'hannah',
      CM: 'james',
      RM: 'laura',
      LCB: 'declan',
      RCB: 'tumelo',
      GK: 'jayden',
    },
  },
  {
    key: 'g4h1',
    game: 4,
    half: 1,
    lineup: {
      ST: 'rashaad',
      LM: 'laurie-ann',
      CM: 'james',
      RM: 'cass',
      LCB: 'josh',
      RCB: 'alex',
      GK: 'jayden',
    },
  },
  {
    key: 'g4h2',
    game: 4,
    half: 2,
    lineup: {
      ST: 'adam',
      LM: 'laura',
      CM: 'james',
      RM: 'laurie-ann',
      LCB: 'declan',
      RCB: 'tumelo',
      GK: 'jayden',
    },
  },
] as const satisfies readonly TeamSheet[])

const firstSheet = TEAM_SHEETS[0]
if (!firstSheet) {
  throw new Error('TEAM_SHEETS must contain at least one sheet')
}
/** Fallback sheet for the root route and for invalid URLs. */
export const DEFAULT_SHEET: TeamSheet = firstSheet

/** Minimum number of girls on the pitch in every half. */
export const MIN_GIRLS_ON_PITCH = 2

/** Only statements that hold for every sheet above. */
export const SELECTION_RULES: readonly string[] = Object.freeze([
  'Minimum 2 girls on the pitch in every half.',
  'Girls play wide midfield or striker only.',
  'Jayden keeps goal in every half except Game 2, when Declan takes over.',
])
