import { clampDepth } from '../math/perspective'
import { computeBoxShadow } from '../math/shadow'
import type { LightSource, SceneItemState } from '../types'

interface PhysicalShadowBindings {
  container: HTMLElement
  items: SceneItemState[]
  depthRange: [number, number]
}

export class PhysicalShadow {
  private light: LightSource | null = null

  constructor(private readonly bindings: PhysicalShadowBindings) {}

  setLight(light: LightSource): void {
    this.light = {
      ...light,
      intensity: light.intensity ?? 1
    }
  }

  apply(): void {
    const containerWidth = this.bindings.container.clientWidth
    const containerHeight = this.bindings.container.clientHeight

    for (const item of this.bindings.items) {
      if (!this.light) {
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
