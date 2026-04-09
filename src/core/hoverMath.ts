import type { SceneItemState, SpringState } from '../types'

const HOVER_DISTANCE_RADIUS = 260

export function computePointerVelocity(
  currentX: number,
  currentY: number,
  previousX: number,
  previousY: number,
  elapsedMs: number
): number {
  return Math.hypot(currentX - previousX, currentY - previousY) / Math.max(1, elapsedMs)
}

export function computeHoverTarget(
  item: SceneItemState,
  pointerX: number,
  pointerY: number,
  responseRange: number,
  velocityFactor: number,
  velocity: number
): number {
  const centerX = item.metrics.x + item.metrics.width / 2
  const centerY = item.metrics.y + item.metrics.height / 2
  const distance = Math.hypot(pointerX - centerX, pointerY - centerY)
  const influence = Math.max(0, 1 - distance / HOVER_DISTANCE_RADIUS)

  return influence * responseRange * (1 + velocity * velocityFactor)
}

export function createSpringState(): SpringState {
  return {
    value: 0,
    velocity: 0,
    target: 0
  }
}
