import type { TeamSheet } from './types'

/**
 * Transcribed from docs/reference/mixed-7s-team-sheets.html (corrected sheets),
 * with later edits: G1H2 Adam ST / James CM / Tumelo DEF; G3H2 Rashaad ST / James CM;
 * then the whole G1H2 and G4H2 sheets swapped; G1H1 Laurie Ann RM in place of Hannah.
 * James withdrew: his four halves went to Jayden (G2H2), Angelo (G3H2), Declan (G4H1)
 * and Alex (G4H2); Rashaad keeps goal for Game 2 with Jayden outfield, and Declan came
 * off G2H1 and G4H2 (Rashaad in at CM) so that both play four outfield halves.
 * G3H1: Jayden ST in place of Cass, with Rashaad in goal.
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
      RM: 'laurie-ann',
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
      GK: 'rashaad',
    },
  },
  {
    key: 'g2h2',
    game: 2,
    half: 2,
    lineup: {
      ST: 'adam',
      LM: 'hannah',
      CM: 'tumelo',
      RM: 'laura',
      LCB: 'declan',
      RCB: 'jayden',
      GK: 'rashaad',
    },
  },
  {
    key: 'g3h1',
    game: 3,
    half: 1,
    lineup: {
      ST: 'jayden',
      LM: 'laurie-ann',
      CM: 'angelo',
      RM: 'maria',
      LCB: 'josh',
      RCB: 'alex',
      GK: 'rashaad',
    },
  },
  {
    key: 'g3h2',
    game: 3,
    half: 2,
    lineup: {
      ST: 'rashaad',
      LM: 'hannah',
      CM: 'angelo',
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
      CM: 'declan',
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
      CM: 'rashaad',
      RM: 'laurie-ann',
      LCB: 'tumelo',
      RCB: 'alex',
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
  'Jayden keeps goal in every half except Game 2 and Game 3 Half 1, when Rashaad takes over.',
])
