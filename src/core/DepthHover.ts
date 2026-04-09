import { createSpring, isSpringSettled } from '../math/spring'
import { computeHoverTarget, computePointerVelocity, createSpringState } from './hoverMath'
import type { DepthHoverOptions, SceneItemState, SpringState } from '../types'

interface DepthHoverBindings {
  container: HTMLElement
  items: SceneItemState[]
  requestRender: () => void
}

const DEFAULT_HOVER: Required<DepthHoverOptions> = {
  responseRange: 80,
  velocityFactor: 0.4,
  returnEasing: 'spring'
}

export class DepthHover {
  private readonly config: Required<DepthHoverOptions>
  private readonly spring = createSpring(260, 28)
  private readonly states = new WeakMap<SceneItemState, SpringState>()
  private lastX = 0
  private lastY = 0
  private lastTime = 0
  private readonly onMoveBound: (event: PointerEvent) => void
  private readonly onLeaveBound: () => void
  private readonly onEnterBound: (event: PointerEvent) => void

  constructor(private readonly bindings: DepthHoverBindings, options?: DepthHoverOptions) {
    this.config = { ...DEFAULT_HOVER, ...options }
    this.onMoveBound = (event: PointerEvent) => {
      this.onPointerMove(event)
    }
    this.onLeaveBound = () => {
      this.resetTargets()
    }
    this.onEnterBound = (event: PointerEvent) => {
      this.lastX = event.clientX
      this.lastY = event.clientY
      this.lastTime = performance.now()
    }

    this.bindings.container.addEventListener('pointerenter', this.onEnterBound)
    this.bindings.container.addEventListener('pointermove', this.onMoveBound)
    this.bindings.container.addEventListener('pointerleave', this.onLeaveBound)
  }

  destroy(): void {
    this.bindings.container.removeEventListener('pointerenter', this.onEnterBound)
    this.bindings.container.removeEventListener('pointermove', this.onMoveBound)
    this.bindings.container.removeEventListener('pointerleave', this.onLeaveBound)
  }

  update(dt: number): boolean {
    let active = false

    for (const item of this.bindings.items) {
      const state = this.getState(item)

      if (this.config.returnEasing === 'linear') {
        if (Math.abs(state.target - state.value) > 0.01) {
          state.value += (state.target - state.value) * Math.min(1, dt * 20)
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

      item.hoverDepth = state.value
    }

    return active
  }

  private onPointerMove(event: PointerEvent): void {
    const containerRect = this.bindings.container.getBoundingClientRect()
    const pointerX = event.clientX - containerRect.left
    const pointerY = event.clientY - containerRect.top
    const now = performance.now()
    const elapsed = Math.max(1, now - this.lastTime)
    const velocity = computePointerVelocity(event.clientX, event.clientY, this.lastX, this.lastY, elapsed)

    this.lastX = event.clientX
    this.lastY = event.clientY
    this.lastTime = now

    for (const item of this.bindings.items) {
      const state = this.getState(item)
      state.target = computeHoverTarget(
        item,
        pointerX,
        pointerY,
        this.config.responseRange,
        this.config.velocityFactor,
        velocity
      )
    }

    this.bindings.requestRender()
  }

  private resetTargets(): void {
    for (const item of this.bindings.items) {
      const state = this.getState(item)
      state.target = 0
    }
    this.bindings.requestRender()
  }

  private getState(item: SceneItemState): SpringState {
    const existing = this.states.get(item)
    if (existing) {
      return existing
    }

    const created = createSpringState()
    this.states.set(item, created)
    return created
  }
}
