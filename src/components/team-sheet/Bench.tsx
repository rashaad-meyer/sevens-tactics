import type { Player } from '../../data/types'

interface BenchProps {
  players: readonly Player[]
}

/** Collapsed by default; the summary row stays tappable at 44px. */
export function Bench({ players }: BenchProps) {
  return (
    <details className="bench">
      <summary className="bench__summary">
        <span className="bench__title display">Off</span>
        <span className="bench__count">{players.length} players</span>
        <span className="bench__chevron" aria-hidden="true" />
      </summary>
      <ul className="bench__list" aria-label="Players off the pitch">
        {players.map((player) => (
          <li key={player.id} className={`bench__chip bench__chip--${player.gender}`}>
            {player.name}
          </li>
        ))}
      </ul>
    </details>
  )
}
