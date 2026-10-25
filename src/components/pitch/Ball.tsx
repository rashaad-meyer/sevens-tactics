import type { CSSProperties } from 'react'

interface BallProps {
  x: number
  y: number
  /** Transition time for the move into this position. */
  durationMs: number
}

const RADIUS = 2.4
const PANEL_RADIUS = 0.55
const PANEL_RING = 1.3
const PANEL_ANGLES = [90, 162, 234, 306, 18]

export function Ball({ x, y, durationMs }: BallProps) {
  const style = {
    transform: `translate(${x}px, ${y}px)`,
    transitionDuration: `${durationMs}ms`,
  } as CSSProperties
  return (
    <g className="ball" style={style} role="img" aria-label="Ball" data-testid="ball">
      <circle className="ball__body" r={RADIUS} />
      <circle className="ball__panel" r={PANEL_RADIUS + 0.1} />
      {PANEL_ANGLES.map((deg) => {
        const rad = (deg * Math.PI) / 180
        return (
          <circle
            key={deg}
            className="ball__panel"
            cx={Math.cos(rad) * PANEL_RING}
            cy={Math.sin(rad) * PANEL_RING}
            r={PANEL_RADIUS}
          />
        )
      })}
    </g>
  )
}
