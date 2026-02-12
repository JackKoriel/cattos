import { describe, it, expect } from 'vitest'
import createAdSequence from '../adSequence'

describe('createAdSequence', () => {
  it('includes all ads when slots < count', () => {
    const count = 7
    const slots = 3
    const seed = 12345
    const seq = createAdSequence(count, slots, seed)
    // sequence length should be at least count (we generate targetLength = max)
    expect(seq.length).toBeGreaterThanOrEqual(count)
    // ensure all indexes 0..count-1 appear at least once
    for (let i = 0; i < count; i++) {
      expect(seq.includes(i)).toBe(true)
    }
  })

  it('does not produce immediate repeats', () => {
    const seq = createAdSequence(5, 20, 999)
    for (let i = 1; i < seq.length; i++) {
      expect(seq[i]).not.toBe(seq[i - 1])
    }
  })
  it('is deterministic for same seed', () => {
    const a = createAdSequence(7, 14, 42)
    const b = createAdSequence(7, 14, 42)
    expect(a).toEqual(b)
  })
})
