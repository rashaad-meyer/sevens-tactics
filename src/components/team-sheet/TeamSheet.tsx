import { getBench, getLineupPlacements } from '../../data/selectors'
import type { TeamSheet as TeamSheetData } from '../../data/types'
import { FormationLayer } from '../pitch/FormationLayer'
import { Pitch } from '../pitch/Pitch'
import { Bench } from './Bench'
import { Legend } from './Legend'
import './team-sheet.css'

interface TeamSheetProps {
  sheet: TeamSheetData
}

export function TeamSheet({ sheet }: TeamSheetProps) {
  const placements = getLineupPlacements(sheet)
  const bench = getBench(sheet)
  const headingId = `sheet-${sheet.key}-heading`
  const title = `Game ${sheet.game}, half ${sheet.half}`
  return (
    <section className="team-sheet" aria-labelledby={headingId}>
      <h1 id={headingId} className="visually-hidden">
        {title} team sheet
      </h1>
      <div className="team-sheet__pitch">
        <Pitch title={`${title} line-up, attacking towards the top`}>
          <FormationLayer placements={placements} animationKey={sheet.key} />
        </Pitch>
      </div>
      <Bench players={bench} />
      <Legend />
    </section>
  )
}
