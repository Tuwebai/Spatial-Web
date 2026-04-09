import { clampDepth, computeMatrix3d } from '../math/perspective'
import { DepthHover } from './DepthHover'
import { DepthScroll } from './DepthScroll'
import { PhysicalShadow } from './PhysicalShadow'
import { collectSceneItems, measureSceneItems } from './sceneItems'
import type {
  DepthHoverOptions,
  DepthLayoutOptions,
  DepthScrollOptions,
  LightSource,
  SceneItemState
} from '../types'

const DEFAULT_LAYOUT: Required<DepthLayoutOptions> = {
  perspective: 1000,
  depthRange: [-300, 300],
  autoUpdate: true
}

export class DepthLayout {
  private readonly container: HTMLElement
  private readonly options: Required<DepthLayoutOptions>
  private readonly items: SceneItemState[] = []
  private readonly shadowModule: PhysicalShadow
  private resizeObserver: ResizeObserver | null = null
  private hoverModule: DepthHover | null = null
  private scrollModule: DepthScroll | null = null
  private frameId = 0
  private lastFrameTime = 0
  private renderQueued = false
  private readonly requestRenderBound: () => void

  constructor(selector: string, options?: DepthLayoutOptions) {
    const container = document.querySelector<HTMLElement>(selector)
    if (!container) {
      throw new Error(`DepthLayout: no se encontro el contenedor "${selector}".`)
    }

    this.container = container
    this.options = { ...DEFAULT_LAYOUT, ...options }
    this.requestRenderBound = () => this.requestRender()
    this.items.push(...collectSceneItems(this.container))
    this.shadowModule = new PhysicalShadow({
      items: this.items,
      depthRange: this.options.depthRange
    })

    this.container.style.transformStyle = 'preserve-3d'
    this.container.style.perspective = `${this.options.perspective}px`

    if (this.options.autoUpdate && 'ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this.measure()
        this.requestRenderBound()
      })
      this.resizeObserver.observe(this.container)
      for (const item of this.items) {
        this.resizeObserver.observe(item.element)
      }
    }

    this.measure()
    this.render()
  }

  enableDepthScroll(options?: DepthScrollOptions): void {
    this.scrollModule?.destroy()
    this.scrollModule = new DepthScroll(
      {
        container: this.container,
        items: this.items,
        requestRender: this.requestRenderBound
      },
      options
    )
    this.requestRenderBound()
  }

  enableDepthHover(options?: DepthHoverOptions): void {
    this.hoverModule?.destroy()
    this.hoverModule = new DepthHover(
      {
        container: this.container,
        items: this.items,
        requestRender: this.requestRenderBound
      },
      options
    )
    this.requestRenderBound()
  }

  setLight(light: LightSource): void {
    this.shadowModule.setLight(light)
    this.requestRenderBound()
  }

  destroy(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
    }

    this.resizeObserver?.disconnect()
    this.scrollModule?.destroy()
    this.hoverModule?.destroy()
  }

  private measure(): void {
    measureSceneItems(this.container, this.items)
  }

  private requestRender(): void {
    if (this.renderQueued) {
      return
    }

    this.renderQueued = true
    this.frameId = requestAnimationFrame((time) => {
      const delta = this.lastFrameTime === 0 ? 1 / 60 : Math.min(0.05, (time - this.lastFrameTime) / 1000)
      this.lastFrameTime = time
      this.renderQueued = false
      const active = this.render(delta)
      if (active) {
        this.requestRender()
      }
    })
  }

  private render(dt = 1 / 60): boolean {
    const scrollActive = this.scrollModule?.update(dt) ?? false
    const hoverActive = this.hoverModule?.update(dt) ?? false

    for (const item of this.items) {
      const depth = clampDepth(item.baseDepth + item.scrollDepth + item.hoverDepth, this.options.depthRange)
      item.appliedDepth = depth
      item.element.style.transform = `matrix3d(${computeMatrix3d(depth, this.options.perspective)})`
    }

    this.shadowModule.apply()

    return scrollActive || hoverActive
  }
}
