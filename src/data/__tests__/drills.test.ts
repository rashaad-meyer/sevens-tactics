import { describe, expect, it } from 'vitest'
import { BALL_OFFSET, DRILLS, getDrill, resolveDrillFrames } from '../drills'
import { FORMATION_231, PITCH_VIEWBOX } from '../formation'
import type { SlotId } from '../types'

const SLOTS: readonly SlotId[] = FORMATION_231.map((s) => s.slotId)
const pattern1 = getDrill('attacking-1')!
const frames = resolveDrillFrames(pattern1)

describe('attacking pattern 1', () => {
  it('starts with the ball at the GK and both defenders at the corners of the box', () => {
    const first = frames[0]!
    expect(first.durationMs).toBe(0)
    expect(first.ballHolder).toBe('GK')
    expect(first.ball).toEqual({ x: 50 + BALL_OFFSET.x, y: 130 + BALL_OFFSET.y })
    expect(first.positions.LCB.x).toBeLessThan(30)
    expect(first.positions.RCB.x).toBeGreaterThan(70)
    expect(first.positions.LCB.y).toBeGreaterThan(118)
    expect(first.positions.RCB.y).toBe(first.positions.LCB.y)
    // Mirrored around the centre line.
    expect(first.positions.LCB.x + first.positions.RCB.x).toBe(100)
  })

  it('passes GK → LCB → LM → CM → ST and ends with a shot', () => {
    const holders = frames.map((f) => f.ballHolder)
    const passes = holders.filter((h, i) => h && h !== holders[i - 1])
    expect(passes).toEqual(['GK', 'LCB', 'LM', 'CM', 'ST'])
    const last = frames.at(-1)!
    expect(last.ballHolder).toBeUndefined()
    expect(last.ball.y).toBeLessThan(5)
    expect(last.ball.x).toBeGreaterThan(43)
    expect(last.ball.x).toBeLessThan(57)
  })

  it('moves players in the described order: LM drops, CM drifts wide, ST runs through from his spot', () => {
    const start = frames[0]!.positions
    const lmDrop = frames.findIndex((f) => f.positions.LM.y > start.LM.y)
    const cmWide = frames.findIndex((f) => f.positions.CM.x < start.CM.x)
    const stThrough = frames.findIndex((f) => f.positions.ST.y < 20)
    expect(lmDrop).toBeGreaterThan(0)
    expect(cmWide).toBeGreaterThan(lmDrop)
    expect(stThrough).toBeGreaterThan(cmWide)
    // CM drifts towards the side LM vacated, not across the pitch.
    expect(frames[cmWide]!.positions.CM.x).toBeGreaterThan(start.LM.x)
    // The striker holds his original position until the through ball is played.
    for (const f of frames.slice(0, stThrough)) expect(f.positions.ST).toEqual(start.ST)
    expect(Math.abs(frames[stThrough]!.positions.ST.x - start.ST.x)).toBeLessThan(6)
  })

  it('keeps every player inside the pitch in every frame and never moves the GK', () => {
    for (const frame of frames) {
      for (const slot of SLOTS) {
        const { x, y } = frame.positions[slot]
        expect(x).toBeGreaterThan(4)
        expect(x).toBeLessThan(PITCH_VIEWBOX.width - 4)
        expect(y).toBeGreaterThan(4)
        expect(y).toBeLessThan(PITCH_VIEWBOX.height - 4)
      }
      expect(frame.positions.GK).toEqual(frames[0]!.positions.GK)
    }
  })

  it('carries positions forward between steps without mutating the drill', () => {
    const before = JSON.stringify(pattern1)
    resolveDrillFrames(pattern1)
    expect(JSON.stringify(pattern1)).toBe(before)
    expect(frames).toHaveLength(pattern1.steps.length)
    // LM stays dropped after step 2 even though later steps do not mention it.
    expect(frames.at(-1)!.positions.LM).toEqual(frames[2]!.positions.LM)
  })

  it('exposes the drill list and lookup', () => {
    expect(DRILLS.map((d) => d.id)).toEqual(['attacking-1'])
    expect(getDrill('nope')).toBeUndefined()
    expect(Object.isFrozen(DRILLS)).toBe(true)
  })
})
