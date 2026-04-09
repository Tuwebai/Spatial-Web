import { describe, expect, it } from 'vitest'
import { computeBoxShadow } from '../src/math/shadow'

describe('shadow math', () => {
  it('returns a multi-layer box-shadow string', () => {
    const shadow = computeBoxShadow(
      { x: 80, y: 20, z: 140 },
      { x: 180, y: -120, z: 600 },
      1.3
    )

    expect(shadow.match(/rgba\(/g)).toHaveLength(2)
    expect(shadow).toContain('px')
    expect(shadow).toContain('rgba(')
  })

  it('changes projection when the light moves', () => {
    const leftLight = computeBoxShadow(
      { x: 0, y: 0, z: 120 },
      { x: -180, y: -120, z: 600 },
      1.1
    )
    const rightLight = computeBoxShadow(
      { x: 0, y: 0, z: 120 },
      { x: 180, y: -120, z: 600 },
      1.1
    )

    expect(leftLight).not.toBe(rightLight)
  })
})
