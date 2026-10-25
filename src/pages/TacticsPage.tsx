import { Navigate } from 'react-router'
import { Pitch } from '../components/pitch/Pitch'
import { PositionMarker } from '../components/pitch/PositionMarker'
import { FORMATION_231 } from '../data/formation'
import { DEFAULT_TACTIC } from '../data/tactics'
import { tacticPath, useSelectedTactic } from '../hooks/useSelectedTactic'

/**
 * Shows the seven slots in the chosen shape. Markers are keyed by slot and
 * positioned by transform, so switching tactic slides each player to their
 * new spot instead of redrawing.
 */
export function TacticsPage() {
  const { tactic, invalid } = useSelectedTactic()
  if (invalid) {
    return <Navigate to={tacticPath(DEFAULT_TACTIC.id)} replace />
  }
  return (
    <section className="tactics" aria-labelledby="tactics-heading">
      <div className="tactics__intro">
        <h1 id="tactics-heading" className="tactics__title display">
          {tactic.name} <span className="tactics__shape">{tactic.shape}</span>
        </h1>
        <p className="page-copy">{tactic.description}</p>
      </div>
      <div className="tactics__pitch">
        <Pitch title={`${tactic.name} shape, ${tactic.shape}, attacking towards the top`}>
          {FORMATION_231.map((slot, index) => {
            const point = tactic.positions[slot.slotId]
            return (
              <PositionMarker
                key={slot.slotId}
                x={point.x}
                y={point.y}
                position={slot.position}
                variant="neutral"
                label={slot.label}
                index={index}
              />
            )
          })}
        </Pitch>
      </div>
    </section>
  )
}
