import { PITCH_VIEWBOX } from '../../data/formation'

/** All measurements are in viewBox units (100 wide by 150 tall). */
export const PITCH = Object.freeze({
  width: PITCH_VIEWBOX.width,
  height: PITCH_VIEWBOX.height,
  inset: 4,
  stripeHeight: 10.142857, // 142 / 14 stripes
  lineWidth: 0.6,
  centreCircleRadius: 9,
  penaltyArea: { width: 50, depth: 18 },
  goalArea: { width: 24, depth: 6 },
  penaltySpotFromLine: 13,
  goal: { width: 14, depth: 3 },
  cornerRadius: 2,
})

export const MARKER = Object.freeze({
  radius: 7.5,
  ringWidth: 1,
  codeFontSize: 5.4,
  plateOffsetY: 12.6,
  plateHeight: 7.4,
  plateRadius: 2,
  plateMinWidth: 13,
  plateCharWidth: 2.55,
  platePaddingX: 2,
  nameFontSize: 5,
})

export const FIELD = Object.freeze({
  x: PITCH.inset,
  y: PITCH.inset,
  width: PITCH.width - PITCH.inset * 2,
  height: PITCH.height - PITCH.inset * 2,
})

export function platePixelWidth(text: string): number {
  return Math.max(
    MARKER.plateMinWidth,
    text.length * MARKER.plateCharWidth + MARKER.platePaddingX * 2,
  )
}
