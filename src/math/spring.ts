import type { SpringState } from '../types'

export interface SpringTickResult {
  value: number
  velocity: number
}

export interface SpringController {
  tick(target: number, current: number, velocity: number, dt: number): SpringTickResult
}

export function createSpring(stiffness = 220, damping = 24): SpringController {
  return {
    tick(target: number, current: number, velocity: number, dt: number): SpringTickResult {
      const seconds = Math.max(1 / 120, dt)
      const displacement = target - current
      const springForce = displacement * stiffness
      const dampingForce = velocity * damping
      const acceleration = springForce - dampingForce
      const nextVelocity = velocity + acceleration * seconds
      const nextValue = current + nextVelocity * seconds

      return {
        value: nextValue,
        velocity: nextVelocity
      }
    }
  }
}

export function isSpringSettled(state: SpringState, threshold = 0.01): boolean {
  return Math.abs(state.target - state.value) < threshold && Math.abs(state.velocity) < threshold
}
