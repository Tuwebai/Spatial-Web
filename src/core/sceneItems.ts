import type { SceneItemMetrics, SceneItemState } from '../types'

function createEmptyMetrics(): SceneItemMetrics {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }
}

export function collectSceneItems(container: HTMLElement): SceneItemState[] {
  const elements = Array.from(container.querySelectorAll<HTMLElement>('[data-depth]'))

  return elements.map((element) => {
    const parsedDepth = Number.parseFloat(element.dataset.depth ?? '0')
    element.style.transformStyle = 'preserve-3d'
    element.style.willChange = 'transform, box-shadow'

    return {
      element,
      baseDepth: Number.isFinite(parsedDepth) ? parsedDepth : 0,
      scrollDepth: 0,
      hoverDepth: 0,
      appliedDepth: 0,
      metrics: createEmptyMetrics()
    }
  })
}

export function measureSceneItems(container: HTMLElement, items: SceneItemState[]): void {
  const containerRect = container.getBoundingClientRect()

  for (const item of items) {
    const rect = item.element.getBoundingClientRect()
    item.metrics = {
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height
    }
  }
}
