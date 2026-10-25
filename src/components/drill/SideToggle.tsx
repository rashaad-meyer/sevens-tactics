import { SIDES, type Side } from '../../data/mirror'

interface SideToggleProps {
  side: Side
  onChange: (side: Side) => void
}

const LABELS: Readonly<Record<Side, string>> = { left: 'Left', right: 'Right' }

/** Flips a pattern to the other wing. */
export function SideToggle({ side, onChange }: SideToggleProps) {
  return (
    <div className="side-toggle" role="group" aria-label="Play the pattern up the">
      {SIDES.map((option) => (
        <button
          key={option}
          type="button"
          className={`side-toggle__option${option === side ? ' is-active' : ''}`}
          aria-pressed={option === side}
          onClick={() => onChange(option)}
        >
          {LABELS[option]}
        </button>
      ))}
    </div>
  )
}
