import { describe, expect, it } from 'vitest'
import { createSpring, isSpringSettled } from '../src/math/spring'

describe('spring math', () => {
  it('moves value toward the target over time', () => {
    const spring = createSpring()
    const result = spring.tick(100, 0, 0, 1 / 60)

    expect(result.value).toBeGreaterThan(0)
    expect(result.velocity).toBeGreaterThan(0)
  })

  it('detects when a spring is settled', () => {
    expect(isSpringSettled({ target: 10, value: 10.005, velocity: 0.005 })).toBe(true)
    expect(isSpringSettled({ target: 10, value: 8, velocity: 0.5 })).toBe(false)
  })
})
