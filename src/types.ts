export interface DepthLayoutOptions {
  perspective?: number
  depthRange?: [number, number]
  autoUpdate?: boolean
}

export interface DepthScrollOptions {
  axis?: 'z' | 'mixed'
  speed?: number
  easing?: 'spring' | 'linear'
}

export interface DepthHoverOptions {
  responseRange?: number
  velocityFactor?: number
  returnEasing?: 'spring' | 'linear'
}

export interface LightSource {
  x: number
  y: number
  z: number
  intensity?: number
}

export interface Vec2 {
  x: number
  y: number
}

export interface Vec3 extends Vec2 {
  z: number
}

export interface SceneItemMetrics {
  x: number
  y: number
  width: number
  height: number
}

export interface SceneItemState {
  element: HTMLElement
  baseDepth: number
  scrollDepth: number
  hoverDepth: number
  appliedDepth: number
  metrics: SceneItemMetrics
}

export interface SpringState {
  value: number
  velocity: number
  target: number
}

export interface SceneSnapshot {
  container: HTMLElement
  items: SceneItemState[]
  perspective: number
  depthRange: [number, number]
  light: LightSource | null
}
