import { displayName } from '../../data/players'
import type { Placement } from '../../data/types'
import { MARKER, platePixelWidth } from './pitchGeometry'
import { PositionMarker } from './PositionMarker'

interface PlayerMarkerProps {
  placement: Placement
  index: number
}

/** PositionMarker plus a high-contrast name plate beneath the disc. */
export function PlayerMarker({ placement, index }: PlayerMarkerProps) {
  const name = displayName(placement.player)
  const width = platePixelWidth(name)
  const plateTop = MARKER.plateOffsetY - MARKER.plateHeight / 2
  return (
    <PositionMarker
      x={placement.x}
      y={placement.y}
      position={placement.position}
      variant={placement.variant}
      label={`${placement.label}: ${placement.player.name}`}
      index={index}
    >
      <g className="marker__plate" data-testid="name-plate">
        <rect
          x={-width / 2}
          y={plateTop}
          width={width}
          height={MARKER.plateHeight}
          rx={MARKER.plateRadius}
        />
        <text
          x={0}
          y={MARKER.plateOffsetY + MARKER.nameFontSize * 0.35}
          textAnchor="middle"
          fontSize={MARKER.nameFontSize}
        >
          {name}
        </text>
      </g>
    </PositionMarker>
  )
}
