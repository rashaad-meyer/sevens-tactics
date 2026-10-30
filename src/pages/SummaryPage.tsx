import { WhoPlaysWhen } from '../components/summary/WhoPlaysWhen'
import { FIXTURES, HALF_MINUTES, kickoffTime } from '../data/fixtures'
import { getHalvesPlayed } from '../data/selectors'
import { SELECTION_RULES } from '../data/teamSheets'
import type { HalvesPlayed } from '../data/types'

function formatHalves(row: HalvesPlayed): string {
  return row.inGoal > 0 ? `${row.outfield} (+${row.inGoal} in goal)` : String(row.outfield)
}

function HalvesTable({ title, rows }: { title: string; rows: readonly HalvesPlayed[] }) {
  return (
    <section className="summary__card" aria-labelledby={`summary-${title}`}>
      <h2 id={`summary-${title}`} className="display">
        Halves played – {title}
      </h2>
      <table className="summary__table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.player.id}>
              <td>{row.player.name}</td>
              <td>{formatHalves(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function Fixtures() {
  return (
    <section className="summary__card" aria-labelledby="summary-fixtures">
      <h2 id="summary-fixtures" className="display">
        Fixtures
      </h2>
      <ol className="fixtures">
        {FIXTURES.map((fixture) => (
          <li key={fixture.game} className="fixtures__item">
            <span className="fixtures__time display">{kickoffTime(fixture.game)}</span>
            <span>
              Game {fixture.game} v {fixture.opponent}
            </span>
          </li>
        ))}
      </ol>
      <p className="summary__hint summary__hint--after">
        Two {HALF_MINUTES}-minute halves with no break, so the second half starts at quarter past.
      </p>
    </section>
  )
}

export function SummaryPage() {
  const halves = getHalvesPlayed()
  const girls = halves.filter((row) => row.player.gender === 'f')
  const boys = halves.filter((row) => row.player.gender === 'm')
  return (
    <>
      <h1 className="page-title display">Summary</h1>
      <div className="summary">
        <WhoPlaysWhen />
        <HalvesTable title="girls" rows={girls} />
        <HalvesTable title="boys" rows={boys} />
        <Fixtures />
        <section className="summary__card" aria-labelledby="summary-rules">
          <h2 id="summary-rules" className="display">
            Selection rules
          </h2>
          <ul className="summary__rules">
            {SELECTION_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
