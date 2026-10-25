import { getTacticOptionGroups, type TacticId } from '../../data/tactics'
import { HeaderSelect } from '../ui/HeaderSelect'

interface TacticSelectProps {
  value: TacticId
  onChange: (id: TacticId) => void
}

const GROUPS = getTacticOptionGroups()

export function TacticSelect({ value, onChange }: TacticSelectProps) {
  return <HeaderSelect id="tactic" label="Tactic" value={value} groups={GROUPS} onChange={onChange} />
}
