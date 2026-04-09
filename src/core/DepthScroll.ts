import { createSpring, isSpringSettled } from '../math/spring'
import type { DepthScrollOptions, SceneItemState, SpringState } from '../types'

interface DepthScrollBindings {
  container: HTMLElement
  items: SceneItemState[]
  requestRender: () => void
}

const DEFAULT_SCROLL: Required<DepthScrollOptions> = {
  axis: 'mixed',
  speed: 0.8,
  easing: 'spring'
}

export class DepthScroll {
  private readonly config: Required<DepthScrollOptions>
  private readonly spring = createSpring()
  private readonly states = new WeakMap<SceneItemState, SpringState>()
  private readonly onWheelBound: (event: WheelEvent) => void

  constructor(private readonly bindings: DepthScrollBindings, options?: DepthScrollOptions) {
    this.config = { ...DEFAULT_SCROLL, ...options }
    this.onWheelBound = (event: WheelEvent) => {
      this.onWheel(event)
    }

    this.bindings.container.addEventListener('wheel', this.onWheelBound, { passive: true })
  }

  destroy(): void {
    this.bindings.container.removeEventListener('wheel', this.onWheelBound)
  }

  update(dt: number): boolean {
    let active = false

    for (const item of this.bindings.items) {
      const state = this.getState(item)

      if (this.config.easing === 'linear') {
        if (Math.abs(state.target - state.value) > 0.01) {
          state.value += (state.target - state.value) * Math.min(1, dt * 18)
          active = true
        } else {
          state.value = state.target
        }
      } else if (!isSpringSettled(state)) {
        const next = this.spring.tick(state.target, state.value, state.velocity, dt)
        state.value = next.value
        state.velocity = next.velocity
        active = true
      } else {
        state.value = state.target
        state.velocity = 0
      }

      item.scrollDepth = state.value
    }

    return active
  }

  private onWheel(event: WheelEvent): void {
    const axisFactor = this.config.axis === 'z' ? 1 : 0.55
    const delta = event.deltaY * this.config.speed * axisFactor

    for (const item of this.bindings.items) {
      const state = this.getState(item)
      state.target -= delta
    }

    this.bindings.requestRender()
  }

  private getState(item: SceneItemState): SpringState {
    const existing = this.states.get(item)
    if (existing) {
      return existing
    }

    const created: SpringState = {
      value: 0,
      velocity: 0,
      target: 0
    }

    this.states.set(item, created)
    return created
  }
}
