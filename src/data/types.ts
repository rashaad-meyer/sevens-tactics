export type Gender = 'f' | 'm'

export type PlayerId =
  | 'cass'
  | 'hannah'
  | 'laura'
  | 'laurie-ann'
  | 'maria'
  | 'josh'
  | 'declan'
  | 'adam'
  | 'alex'
  | 'rashaad'
  | 'angelo'
  | 'tumelo'
  | 'jayden'

export interface Player {
  readonly id: PlayerId
  readonly name: string
  /** Short label used on the pitch marker when the full name is too long. */
  readonly shortName?: string
  readonly gender: Gender
}

export type PositionCode = 'ST' | 'LM' | 'CM' | 'RM' | 'DEF' | 'GK'

export type SlotId = 'ST' | 'LM' | 'CM' | 'RM' | 'LCB' | 'RCB' | 'GK'

export interface FormationSlot {
  readonly slotId: SlotId
  readonly position: PositionCode
  readonly label: string
  /** Pitch coordinates in viewBox units (0-100 across, 0-150 down). */
  readonly x: number
  readonly y: number
}

export type GameNumber = 1 | 2 | 3 | 4
export type HalfNumber = 1 | 2

export type SheetKey = `g${GameNumber}h${HalfNumber}`

export type Lineup = Readonly<Record<SlotId, PlayerId>>

export interface TeamSheet {
  readonly key: SheetKey
  readonly game: GameNumber
  readonly half: HalfNumber
  readonly lineup: Lineup
}

export interface PitchPoint {
  readonly x: number
  readonly y: number
}

export type MarkerVariant = 'girl' | 'boy' | 'gk' | 'neutral' | 'active'

export interface Placement {
  readonly slotId: SlotId
  readonly position: PositionCode
  readonly label: string
  readonly x: number
  readonly y: number
  readonly player: Player
  readonly variant: MarkerVariant
}

export interface SheetOption {
  readonly value: SheetKey
  readonly label: string
}

export interface HalvesPlayed {
  readonly player: Player
  readonly outfield: number
  readonly inGoal: number
}
