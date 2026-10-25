import type { CSSProperties } from 'react'
import { resolveDrillFrames, type Drill } from '../../data/drills'
import { FORMATION_231 } from '../../data/formation'
import { useDrillPlayback } from '../../hooks/useDrillPlayback'
import { Ball } from '../pitch/Ball'
import { Pitch } from '../pitch/Pitch'
import { PositionMarker } from '../pitch/PositionMarker'
import { DrillControls } from './DrillControls'
import './drill.css'

interface DrillPlayerProps {
  drill: Drill
}

/** Steps a drill through its frames; players and ball slide between them. */
export function DrillPlayer({ drill }: DrillPlayerProps) {
  const frames = resolveDrillFrames(drill)
  const playback = useDrillPlayback(frames)
  const { frame } = playback
  const layerStyle = { '--step-duration': `${frame.durationMs}ms` } as CSSProperties

  return (
    <div className="drill">
      <p className="drill__caption" aria-live="polite">
        <span className="drill__step display">
          Step {playback.index + 1}/{playback.count}
        </span>
        {frame.caption}
      </p>
      <div className="drill__pitch">
        <Pitch title={`${drill.name}, step ${playback.index + 1} of ${playback.count}`}>
          <g className="drill__layer" style={layerStyle} data-testid="drill-layer">
            {FORMATION_231.map((slot, index) => {
              const point = frame.positions[slot.slotId]
              const hasBall = frame.ballHolder === slot.slotId
              return (
                <PositionMarker
                  key={slot.slotId}
                  x={point.x}
                  y={point.y}
                  position={slot.position}
                  variant={hasBall ? 'active' : 'neutral'}
                  label={`${slot.label}${hasBall ? ' (on the ball)' : ''}`}
                  index={index}
                />
              )
            })}
            <Ball x={frame.ball.x} y={frame.ball.y} durationMs={frame.durationMs} />
          </g>
        </Pitch>
      </div>
      <DrillControls playback={playback} />
    </div>
  )
}
