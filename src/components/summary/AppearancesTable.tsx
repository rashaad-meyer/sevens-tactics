import { formatAppearance, getAppearances } from '../../data/selectors'

const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']

function ordinal(index: number): string {
  return ORDINALS[index] ?? `${index + 1}th`
}

/** Who plays when: one row per player, one column per half they play, cells as "game,half". */
export function AppearancesTable() {
  const rows = getAppearances()
  const columns = Math.max(...rows.map((row) => row.appearances.length))
  return (
    <section className="summary__card summary__card--wide" aria-labelledby="summary-appearances">
      <h2 id="summary-appearances" className="display">
        Who plays when
      </h2>
      <p className="summary__hint">Cells read game,half. GK marks a half in goal.</p>
      <div className="summary__scroll">
        <table className="appearances">
          <thead>
            <tr>
              <th scope="col">Player</th>
              {Array.from({ length: columns }, (_, i) => (
                <th key={i} scope="col">
                  {ordinal(i)} half
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ player, appearances }) => (
              <tr key={player.id}>
                <th scope="row">{player.name}</th>
                {Array.from({ length: columns }, (_, i) => {
                  const appearance = appearances[i]
                  return (
                    <td key={i} className={appearance?.inGoal ? 'appearances__gk' : undefined}>
                      {appearance ? formatAppearance(appearance) : ''}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
