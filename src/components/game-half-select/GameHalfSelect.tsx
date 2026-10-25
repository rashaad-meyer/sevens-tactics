import { getSheetOptions } from '../../data/selectors'
import type { SheetKey } from '../../data/types'
import { HeaderSelect } from '../ui/HeaderSelect'

interface GameHalfSelectProps {
  value: SheetKey
  onChange: (key: SheetKey) => void
}

const OPTIONS = getSheetOptions()

export function GameHalfSelect({ value, onChange }: GameHalfSelectProps) {
  return (
    <HeaderSelect id="game-half" label="Team sheet" value={value} options={OPTIONS} onChange={onChange} />
  )
}
