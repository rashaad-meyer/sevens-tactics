const ITEMS = [
  { variant: 'girl', label: 'Girls' },
  { variant: 'boy', label: 'Boys' },
  { variant: 'gk', label: 'Goalkeeper' },
] as const

export function Legend() {
  return (
    <ul className="legend" aria-label="Legend">
      {ITEMS.map((item) => (
        <li key={item.variant} className="legend__item">
          <span className={`legend__swatch legend__swatch--${item.variant}`} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
