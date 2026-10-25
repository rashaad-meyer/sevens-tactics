import { Navigate } from 'react-router'
import { DrillPlayer } from '../components/drill/DrillPlayer'
import { Pitch } from '../components/pitch/Pitch'
import { PositionMarker } from '../components/pitch/PositionMarker'
import { FORMATION_231 } from '../data/formation'
import { DEFAULT_TACTIC, type ShapeTactic } from '../data/tactics'
import { tacticPath, useSelectedTactic } from '../hooks/useSelectedTactic'

/**
 * Static shape view. Markers are keyed by slot and positioned by transform,
 * so switching shape slides each player to their new spot.
 */
function ShapeView({ tactic }: { tactic: ShapeTactic }) {
  return (
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
  )
}

export function TacticsPage() {
  const { tactic, invalid } = useSelectedTactic()
  if (invalid) {
    return <Navigate to={tacticPath(DEFAULT_TACTIC.id)} replace />
  }
  const badge = tactic.kind === 'shape' ? tactic.shape : 'Pattern'
  return (
    <section className="tactics" aria-labelledby="tactics-heading">
      <div className="tactics__intro">
        <h1 id="tactics-heading" className="tactics__title display">
          {tactic.name} <span className="tactics__shape">{badge}</span>
        </h1>
        {tactic.kind === 'shape' && <p className="page-copy">{tactic.description}</p>}
      </div>
      {tactic.kind === 'shape' ? (
        <ShapeView tactic={tactic} />
      ) : (
        <DrillPlayer key={tactic.id} drill={tactic} />
      )}
    </section>
  )
}
