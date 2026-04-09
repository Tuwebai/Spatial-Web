import { useEffect, useRef } from 'react'
import { DepthLayout } from 'spatial-web'

export function ReactFeatureCards(): JSX.Element {
  const sceneRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!sceneRef.current) return

    const scene = new DepthLayout('#react-feature-cards', {
      perspective: 1000,
      depthRange: [-300, 300]
    })

    scene.enableDepthHover({
      responseRange: 72,
      velocityFactor: 0.45,
      returnEasing: 'spring'
    })

    scene.setLight({
      x: 220,
      y: -140,
      z: 640,
      intensity: 1.2
    })

    return () => scene.destroy()
  }, [])

  return (
    <div
      id="react-feature-cards"
      ref={sceneRef}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 280px))',
        gap: 24,
        padding: 32
      }}
    >
      <article data-depth={-120}>Infrastructure</article>
      <article data-depth={-20}>Workflows</article>
      <article data-depth={80}>Insights</article>
      <article data-depth={180}>Automation</article>
    </div>
  )
}
