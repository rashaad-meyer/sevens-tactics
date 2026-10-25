import type { ReactNode } from 'react'
import { FIELD, PITCH } from './pitchGeometry'
import './pitch.css'

interface PitchProps {
  /**
   * Accessible name for the pitch group. The svg is a group rather than an
   * image so each marker's own label stays reachable by screen readers.
   */
  title: string
  /** Marker layers (and later, a ball layer) drawn on top of the turf. */
  children?: ReactNode
  className?: string
}

const centreX = PITCH.width / 2
const centreY = PITCH.height / 2
const stripeRows = Array.from({ length: 14 }, (_, i) => i)

function PenaltyEnd({ atTop }: { atTop: boolean }) {
  const { penaltyArea, goalArea, penaltySpotFromLine, goal } = PITCH
  const edgeY = atTop ? FIELD.y : FIELD.y + FIELD.height
  const dir = atTop ? 1 : -1
  const boxY = atTop ? edgeY : edgeY - penaltyArea.depth
  const goalAreaY = atTop ? edgeY : edgeY - goalArea.depth
  const goalY = atTop ? edgeY - goal.depth : edgeY
  return (
    <g>
      <rect
        x={centreX - penaltyArea.width / 2}
        y={boxY}
        width={penaltyArea.width}
        height={penaltyArea.depth}
      />
      <rect x={centreX - goalArea.width / 2} y={goalAreaY} width={goalArea.width} height={goalArea.depth} />
      <circle cx={centreX} cy={edgeY + dir * penaltySpotFromLine} r={0.7} className="pitch__spot" />
      <rect
        x={centreX - goal.width / 2}
        y={goalY}
        width={goal.width}
        height={goal.depth}
        className="pitch__goal"
      />
    </g>
  )
}

export function Pitch({ title, children, className }: PitchProps) {
  return (
    <svg
      className={['pitch', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${PITCH.width} ${PITCH.height}`}
      role="group"
      aria-label={title}
    >
      <rect x={0} y={0} width={PITCH.width} height={PITCH.height} className="pitch__edge" />
      <g className="pitch__turf">
        {stripeRows.map((row) => (
          <rect
            key={row}
            x={FIELD.x}
            y={FIELD.y + row * PITCH.stripeHeight}
            width={FIELD.width}
            height={PITCH.stripeHeight + 0.05}
            className={row % 2 === 0 ? 'pitch__stripe-a' : 'pitch__stripe-b'}
          />
        ))}
      </g>
      <g className="pitch__lines" strokeWidth={PITCH.lineWidth}>
        <rect x={FIELD.x} y={FIELD.y} width={FIELD.width} height={FIELD.height} />
        <line x1={FIELD.x} y1={centreY} x2={FIELD.x + FIELD.width} y2={centreY} />
        <circle cx={centreX} cy={centreY} r={PITCH.centreCircleRadius} />
        <circle cx={centreX} cy={centreY} r={0.7} className="pitch__spot" />
        <PenaltyEnd atTop />
        <PenaltyEnd atTop={false} />
      </g>
      {children}
    </svg>
  )
}
