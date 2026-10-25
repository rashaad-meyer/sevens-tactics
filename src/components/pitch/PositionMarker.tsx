import type { CSSProperties, ReactNode } from 'react'
import type { MarkerVariant, PositionCode } from '../../data/types'
import { MARKER } from './pitchGeometry'

export interface PositionMarkerProps {
  x: number
  y: number
  position: PositionCode
  variant: MarkerVariant
  /** Accessible label for the whole marker, e.g. "Striker: Hannah". */
  label: string
  /** Stagger index used by the entrance animation. */
  index?: number
  /** Extra content positioned relative to the circle centre (e.g. a name plate). */
  children?: ReactNode
}

/**
 * A single position disc with the position code inside it. It has no name of
 * its own so the same component can drive the future tactics animations.
 * Positioned with a CSS transform so only compositor-friendly properties move.
 */
export function PositionMarker({
  x,
  y,
  position,
  variant,
  label,
  index = 0,
  children,
}: PositionMarkerProps) {
  const style = {
    transform: `translate(${x}px, ${y}px)`,
    '--marker-index': index,
  } as CSSProperties
  return (
    <g
      className={`marker marker--${variant}`}
      style={style}
      role="img"
      aria-label={label}
      data-slot-position={position}
    >
      <g className="marker__body">
        <circle className="marker__disc" r={MARKER.radius} />
        <text
          className="marker__code"
          y={MARKER.codeFontSize * 0.36}
          textAnchor="middle"
          fontSize={MARKER.codeFontSize}
        >
          {position}
        </text>
        {children}
      </g>
    </g>
  )
}
