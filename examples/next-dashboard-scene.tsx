'use client'

import { useEffect } from 'react'
import { DepthLayout } from 'spatial-web'

export default function NextDashboardScene(): JSX.Element {
  useEffect(() => {
    const scene = new DepthLayout('#next-dashboard-scene', {
      perspective: 1100,
      depthRange: [-260, 260]
    })

    scene.enableDepthHover({
      responseRange: 56,
      velocityFactor: 0.35,
      returnEasing: 'spring'
    })

    scene.setLight({
      x: 180,
      y: -200,
      z: 700,
      intensity: 1.1
    })

    return () => scene.destroy()
  }, [])

  return (
    <section
      id="next-dashboard-scene"
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: 24,
        padding: 24
      }}
    >
      <article data-depth={20}>Executive surface</article>
      <article data-depth={-80}>Analytics layer</article>
      <article data-depth={-140}>Context layer</article>
    </section>
  )
}
