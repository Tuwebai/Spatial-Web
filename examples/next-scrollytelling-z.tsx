'use client'

import { useEffect } from 'react'
import { DepthLayout } from 'spatial-web'

export default function NextScrollytellingZ(): JSX.Element {
  useEffect(() => {
    const scene = new DepthLayout('#next-scrollytelling-z', {
      perspective: 1100,
      depthRange: [-300, 300]
    })

    scene.enableDepthScroll({
      axis: 'mixed',
      speed: 0.45,
      easing: 'spring'
    })

    scene.setLight({
      x: 140,
      y: -220,
      z: 760,
      intensity: 1.05
    })

    return () => scene.destroy()
  }, [])

  return (
    <section
      id="next-scrollytelling-z"
      style={{
        maxWidth: 920,
        margin: '0 auto',
        padding: '80px 24px 120px',
        display: 'grid',
        gap: 24
      }}
    >
      <article data-depth={-180}>Act 1</article>
      <article data-depth={-60}>Act 2</article>
      <article data-depth={20}>Act 3</article>
      <article data-depth={120}>Act 4</article>
    </section>
  )
}
