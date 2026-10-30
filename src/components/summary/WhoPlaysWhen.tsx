import { useId, useState, type ChangeEvent } from 'react'
import { getFixture, halfStartTime } from '../../data/fixtures'
import {
  formatSheetLabel,
  getAvailability,
  type HalfStatus,
  type PlayerAvailability,
} from '../../data/selectors'
import { TEAM_SHEETS } from '../../data/teamSheets'
import type { PlayerId } from '../../data/types'

type Selection = 'all' | PlayerId

const STATUS_TEXT: Record<HalfStatus, string> = {
  playing: 'Playing',
  goalkeeper: 'In goal',
  off: 'Off',
}

const LEGEND: readonly { status: HalfStatus; label: string }[] = [
  { status: 'playing', label: 'Playing' },
  { status: 'goalkeeper', label: 'Goalkeeper' },
  { status: 'off', label: 'Not playing' },
]

function AvailabilityGrid({ rows }: { rows: readonly PlayerAvailability[] }) {
  return (
    <>
      <div className="summary__scroll">
        <table className="appearances">
          <thead>
            <tr>
              <th scope="col">Player</th>
              {TEAM_SHEETS.map((sheet) => (
                <th key={sheet.key} scope="col">
                  <span aria-hidden="true">
                    {sheet.game}|{sheet.half}
                  </span>
                  <span className="visually-hidden">
                    Game {sheet.game}, half {sheet.half}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ player, halves }) => (
              <tr key={player.id}>
                <th scope="row">{player.name}</th>
                {halves.map(({ sheet, status }) => (
                  <td key={sheet.key} className="appearances__cell">
                    <span className={`appearances__block appearances__block--${status}`} aria-hidden="true">
                      {status === 'goalkeeper' ? 'GK' : ''}
                    </span>
                    <span className="visually-hidden">{STATUS_TEXT[status]}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="appearances-legend" aria-label="Legend">
        {LEGEND.map((item) => (
          <li key={item.status} className="appearances-legend__item">
            <span
              className={`appearances-legend__swatch appearances__block--${item.status}`}
              aria-hidden="true"
            />
            {item.label}
          </li>
        ))}
      </ul>
    </>
  )
}

function PlayerSchedule({ row }: { row: PlayerAvailability }) {
  const halves = row.halves.filter((half) => half.status !== 'off')
  const inGoal = halves.filter((half) => half.status === 'goalkeeper').length
  return (
    <>
      <p className="summary__hint">
        {row.player.name} plays {halves.length} of {row.halves.length} halves
        {inGoal > 0 ? `, ${inGoal} in goal` : ''}.
      </p>
      <ol className="schedule">
        {halves.map(({ sheet, status }) => (
          <li key={sheet.key} className="schedule__item">
            <span className="schedule__label display">{formatSheetLabel(sheet)}</span>
            <span className="schedule__meta">
              {halfStartTime(sheet.game, sheet.half)} · v {getFixture(sheet.game).opponent}
            </span>
            {status === 'goalkeeper' ? <span className="schedule__badge display">In goal</span> : null}
          </li>
        ))}
      </ol>
    </>
  )
}

/** Who plays when: a colour grid of every player by half, or one player's own schedule. */
export function WhoPlaysWhen() {
  const rows = getAvailability()
  const selectId = useId()
  const [selection, setSelection] = useState<Selection>('all')
  const selected = rows.find((row) => row.player.id === selection)

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value
    const isPlayer = rows.some((row) => row.player.id === next)
    setSelection(isPlayer ? (next as PlayerId) : 'all')
  }

  return (
    <section className="summary__card summary__card--wide" aria-labelledby="summary-appearances">
      <div className="summary__card-head">
        <h2 id="summary-appearances" className="display">
          Who plays when
        </h2>
        <div className="summary__filter">
          <label htmlFor={selectId}>Show</label>
          <select id={selectId} value={selection} onChange={handleChange}>
            <option value="all">All players</option>
            {rows.map((row) => (
              <option key={row.player.id} value={row.player.id}>
                {row.player.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selected ? <PlayerSchedule row={selected} /> : <AvailabilityGrid rows={rows} />}
    </section>
  )
}
