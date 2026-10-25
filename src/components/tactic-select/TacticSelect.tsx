import { getTacticOptions, type TacticId } from '../../data/tactics'
import { HeaderSelect } from '../ui/HeaderSelect'

interface TacticSelectProps {
  value: TacticId
  onChange: (id: TacticId) => void
}

const OPTIONS = getTacticOptions()

export function TacticSelect({ value, onChange }: TacticSelectProps) {
  return <HeaderSelect id="tactic" label="Tactic" value={value} options={OPTIONS} onChange={onChange} />
}
