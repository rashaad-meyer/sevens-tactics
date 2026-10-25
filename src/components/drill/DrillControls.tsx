import type { DrillPlayback } from '../../hooks/useDrillPlayback'

interface DrillControlsProps {
  playback: DrillPlayback
}

export function DrillControls({ playback }: DrillControlsProps) {
  const steps = Array.from({ length: playback.count }, (_, i) => i)
  return (
    <div className="drill__controls">
      <ol className="drill__dots" aria-label="Steps">
        {steps.map((i) => (
          <li key={i}>
            <button
              type="button"
              className={`drill__dot${i === playback.index ? ' is-active' : ''}${i < playback.index ? ' is-done' : ''}`}
              aria-label={`Go to step ${i + 1}`}
              aria-current={i === playback.index ? 'step' : undefined}
              onClick={() => playback.goTo(i)}
            />
          </li>
        ))}
      </ol>
      <div className="drill__buttons">
        <button type="button" className="drill__button" onClick={playback.restart} disabled={playback.isFirst}>
          Restart
        </button>
        <button type="button" className="drill__button" onClick={playback.previous} disabled={playback.isFirst}>
          Back
        </button>
        {playback.playing ? (
          <button type="button" className="drill__button drill__button--primary" onClick={playback.pause}>
            Pause
          </button>
        ) : (
          <button type="button" className="drill__button drill__button--primary" onClick={playback.play}>
            {playback.isLast ? 'Replay' : 'Play'}
          </button>
        )}
        <button type="button" className="drill__button" onClick={playback.next} disabled={playback.isLast}>
          Next
        </button>
      </div>
    </div>
  )
}
