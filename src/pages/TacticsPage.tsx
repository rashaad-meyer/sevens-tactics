import { Pitch } from '../components/pitch/Pitch'
import { PositionMarker } from '../components/pitch/PositionMarker'
import { FORMATION_231 } from '../data/formation'

/**
 * Placeholder for the future tactics pages. It proves the pitch and the
 * nameless position markers can be reused without any team-sheet data.
 */
export function TacticsPage() {
  return (
    <section className="tactics" aria-labelledby="tactics-heading">
      <h1 id="tactics-heading" className="page-title display">
        Tactics
      </h1>
      <p className="page-copy">Animated drills are coming soon. Positions shown in the base 2-3-1 shape.</p>
      <div className="tactics__pitch">
        <Pitch title="Base 2-3-1 shape, attacking towards the top">
          {FORMATION_231.map((slot, index) => (
            <PositionMarker
              key={slot.slotId}
              x={slot.x}
              y={slot.y}
              position={slot.position}
              variant="neutral"
              label={slot.label}
              index={index}
            />
          ))}
        </Pitch>
      </div>
    </section>
  )
}
