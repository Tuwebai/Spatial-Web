import { clampDepth } from '../math/perspective'
import { computeBoxShadow } from '../math/shadow'
import type { LightSource, SceneItemState } from '../types'

interface PhysicalShadowBindings {
  getContainerMetrics: () => { width: number; height: number }
  items: SceneItemState[]
  depthRange: [number, number]
}

export class PhysicalShadow {
  private light: LightSource | null = null

  constructor(private readonly bindings: PhysicalShadowBindings) {}

  setLight(light: LightSource): void {
    this.light = {
      ...light,
      intensity: Math.max(0, light.intensity ?? 1)
    }
  }

  apply(): void {
    const containerMetrics = this.bindings.getContainerMetrics()
    const containerWidth = containerMetrics.width
    const containerHeight = containerMetrics.height

    for (const item of this.bindings.items) {
      if (!this.light || this.light.intensity === 0 || containerWidth === 0 || containerHeight === 0) {
        item.element.style.boxShadow = ''
        continue
      }

      const depth = clampDepth(item.appliedDepth, this.bindings.depthRange)
      const planeZ = this.bindings.depthRange[0] - 40
      item.element.style.boxShadow = computeBoxShadow(
        {
          x: item.metrics.x + item.metrics.width / 2 - containerWidth / 2,
          y: item.metrics.y + item.metrics.height / 2 - containerHeight / 2,
          z: depth
        },
        {
          x: this.light.x,
          y: this.light.y,
          z: this.light.z
        },
        this.light.intensity ?? 1,
        planeZ
      )
    }
  }
}
