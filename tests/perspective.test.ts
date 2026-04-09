import { describe, expect, it } from 'vitest'
import { clampDepth, computeMatrix3d, computeScale } from '../src/math/perspective'

describe('perspective math', () => {
  it('clamps depth to the configured range', () => {
    expect(clampDepth(-999, [-300, 300])).toBe(-300)
    expect(clampDepth(120, [-300, 300])).toBe(120)
    expect(clampDepth(999, [-300, 300])).toBe(300)
  })

  it('computes larger scale for foreground depth', () => {
    expect(computeScale(180, 1000)).toBeGreaterThan(1)
    expect(computeScale(-180, 1000)).toBeLessThan(1)
  })

  it('returns a valid matrix3d string with depth in slot 15', () => {
    const matrix = computeMatrix3d(160, 1000).split(',').map((value) => Number(value.trim()))
    expect(matrix).toHaveLength(16)
    expect(matrix[14]).toBe(160)
    expect(matrix[0]).toBeCloseTo(matrix[5], 5)
  })
})
