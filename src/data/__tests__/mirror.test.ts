import { describe, expect, it } from 'vitest'
import { BALL_OFFSET, getDrill, resolveDrillFrames } from '../drills'
import { drillForSide, mirrorCaption, mirrorDrill, parseSide } from '../mirror'

const pattern1 = getDrill('attacking-1')!
const pattern2 = getDrill('attacking-2')!

describe('mirrorDrill', () => {
  it('flips x across the centre line and swaps the wide and defensive roles', () => {
    const left = resolveDrillFrames(pattern1)
    const right = resolveDrillFrames(mirrorDrill(pattern1))
    expect(right).toHaveLength(left.length)
    for (let i = 0; i < left.length; i += 1) {
      const l = left[i]!.positions
      const r = right[i]!.positions
      expect(r.RM).toEqual({ x: 100 - l.LM.x, y: l.LM.y })
      expect(r.LM).toEqual({ x: 100 - l.RM.x, y: l.RM.y })
      expect(r.RCB).toEqual({ x: 100 - l.LCB.x, y: l.LCB.y })
      expect(r.LCB).toEqual({ x: 100 - l.RCB.x, y: l.RCB.y })
      expect(r.ST).toEqual({ x: 100 - l.ST.x, y: l.ST.y })
      expect(r.CM).toEqual({ x: 100 - l.CM.x, y: l.CM.y })
      expect(r.GK).toEqual(l.GK)
      // A held ball keeps its offset from the (mirrored) holder; a loose ball is mirrored exactly.
      const holder = right[i]!.ballHolder
      if (holder) {
        expect(right[i]!.ball).toEqual({ x: r[holder].x + BALL_OFFSET.x, y: r[holder].y + BALL_OFFSET.y })
      } else {
        expect(right[i]!.ball).toEqual({ x: 100 - left[i]!.ball.x, y: left[i]!.ball.y })
      }
    }
  })

  it('moves the ball through the mirrored players', () => {
    const holders = resolveDrillFrames(mirrorDrill(pattern1)).map((f) => f.ballHolder)
    const passes = holders.filter((h, i) => h && h !== holders[i - 1])
    expect(passes).toEqual(['GK', 'RCB', 'RM', 'CM', 'ST'])
    const holders2 = resolveDrillFrames(mirrorDrill(pattern2)).map((f) => f.ballHolder)
    const passes2 = holders2.filter((h, i) => h && h !== holders2[i - 1])
    expect(passes2).toEqual(['GK', 'RCB', 'CM', 'RM', 'CM'])
  })

  it('rewrites captions for the other wing', () => {
    expect(mirrorCaption('The left midfielder drops a little to show for the ball.')).toBe(
      'The right midfielder drops a little to show for the ball.',
    )
    expect(mirrorCaption('Left midfielder lays it inside to the CM.')).toBe('Right midfielder lays it inside to the CM.')
    expect(mirrorCaption('Ball into the box: ST front post, CM middle, RM back post.')).toBe(
      'Ball into the box: ST front post, CM middle, LM back post.',
    )
    // Words that merely contain "left" are untouched.
    expect(mirrorCaption('The space the midfielder has left.')).toBe('The space the midfielder has right.')
    expect(mirrorCaption('cleft')).toBe('cleft')
  })

  it('mirroring twice gives the original back and never mutates the input', () => {
    const before = JSON.stringify(pattern2)
    const twice = mirrorDrill(mirrorDrill(pattern2))
    expect(JSON.stringify(pattern2)).toBe(before)
    expect(twice).toEqual(pattern2)
  })

  it('drillForSide returns the original for left and a mirror for right', () => {
    expect(drillForSide(pattern1, 'left')).toBe(pattern1)
    expect(drillForSide(pattern1, 'right')).toEqual(mirrorDrill(pattern1))
  })

  it('parseSide defaults to left for anything but "right"', () => {
    expect(parseSide('right')).toBe('right')
    expect(parseSide('left')).toBe('left')
    expect(parseSide('sideways')).toBe('left')
    expect(parseSide(null)).toBe('left')
    expect(parseSide(undefined)).toBe('left')
  })
})
