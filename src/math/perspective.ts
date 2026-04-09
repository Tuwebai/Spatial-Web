const EPSILON = 0.001

export function clampDepth(depth: number, range: [number, number]): number {
  return Math.min(range[1], Math.max(range[0], depth))
}

export function computeScale(depth: number, perspective: number): number {
  const safePerspective = Math.max(EPSILON, perspective - depth)
  return perspective / safePerspective
}

export function computeMatrix3d(depth: number, perspective: number): string {
  const scale = computeScale(depth, perspective)

  return [
    scale, 0, 0, 0,
    0, scale, 0, 0,
    0, 0, 1, 0,
    0, 0, depth, 1
  ].join(', ')
}
