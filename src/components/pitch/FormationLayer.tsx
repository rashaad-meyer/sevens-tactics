import type { Placement } from '../../data/types'
import { PlayerMarker } from './PlayerMarker'

interface FormationLayerProps {
  placements: readonly Placement[]
  /** Changing this remounts the layer so the entrance animation replays. */
  animationKey?: string
}

export function FormationLayer({ placements, animationKey }: FormationLayerProps) {
  return (
    <g className="formation" key={animationKey} data-testid="formation-layer">
      {placements.map((placement, index) => (
        <PlayerMarker key={placement.slotId} placement={placement} index={index} />
      ))}
    </g>
  )
}
