import { clampDepth, computeMatrix3d } from '../math/perspective'
import { DepthHover } from './DepthHover'
import { DepthScroll } from './DepthScroll'
import { PhysicalShadow } from './PhysicalShadow'
import { collectSceneItems, createSceneItem, measureSceneItems, resetSceneItemElement } from './sceneItems'
import type {
  ContainerMetrics,
  DepthHoverOptions,
  DepthLayoutOptions,
  DepthScrollOptions,
  LightSource,
  SceneSnapshot,
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
  private containerMetrics: ContainerMetrics = {
    left: 0,
    top: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }
  private resizeObserver: ResizeObserver | null = null
  private mutationObserver: MutationObserver | null = null
  private hoverModule: DepthHover | null = null
  private scrollModule: DepthScroll | null = null
  private light: LightSource | null = null
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
      getContainerMetrics: () => this.containerMetrics,
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

    if (this.options.autoUpdate && 'MutationObserver' in window) {
      this.mutationObserver = new MutationObserver(() => {
        this.syncItems()
      })
      this.mutationObserver.observe(this.container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-depth']
      })
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
        depthRange: this.options.depthRange,
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
        getContainerMetrics: () => this.containerMetrics,
        items: this.items,
        requestRender: this.requestRenderBound
      },
      options
    )
    this.requestRenderBound()
  }

  setLight(light: LightSource): void {
    this.light = {
      ...light,
      intensity: light.intensity ?? 1
    }
    this.shadowModule.setLight(light)
    this.requestRenderBound()
  }

  getSnapshot(): SceneSnapshot {
    return {
      items: this.items.map((item) => ({
        baseDepth: item.baseDepth,
        scrollDepth: item.scrollDepth,
        hoverDepth: item.hoverDepth,
        appliedDepth: item.appliedDepth,
        metrics: { ...item.metrics }
      })),
      perspective: this.options.perspective,
      depthRange: [...this.options.depthRange] as [number, number],
      light: this.light ? { ...this.light } : null,
      isAnimating: this.renderQueued || this.items.some((item) => Math.abs(item.scrollDepth) > 0.01 || Math.abs(item.hoverDepth) > 0.01)
    }
  }

  destroy(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
    }

    this.resizeObserver?.disconnect()
    this.mutationObserver?.disconnect()
    this.scrollModule?.destroy()
    this.hoverModule?.destroy()
    this.light = null
    this.container.style.transformStyle = ''
    this.container.style.perspective = ''

    for (const item of this.items) {
      resetSceneItemElement(item.element)
    }
  }

  refresh(): void {
    this.syncItems()
  }

  private measure(): void {
    const rect = this.container.getBoundingClientRect()
    this.containerMetrics = {
      left: rect.left,
      top: rect.top,
      x: 0,
      y: 0,
      width: rect.width,
      height: rect.height
    }
    measureSceneItems(this.containerMetrics, this.items)
  }

  private syncItems(): void {
    const nextElements = new Set(this.container.querySelectorAll<HTMLElement>('[data-depth]'))

    for (let index = this.items.length - 1; index >= 0; index -= 1) {
      const item = this.items[index]
      if (!item) {
        continue
      }

      if (nextElements.has(item.element)) {
        item.baseDepth = Number.parseFloat(item.element.dataset.depth ?? '0') || 0
        continue
      }

      this.resizeObserver?.unobserve(item.element)
      resetSceneItemElement(item.element)
      this.items.splice(index, 1)
    }

    for (const element of nextElements) {
      const existing = this.items.find((item) => item.element === element)
      if (existing) {
        continue
      }

      const item = createSceneItem(element)
      this.items.push(item)
      this.resizeObserver?.observe(element)
    }

    this.measure()
    this.requestRenderBound()
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
