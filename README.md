# Spatial Web

Pure JavaScript/TypeScript library for semantic depth layout on the DOM. `spatial-web` adds a real Z axis to regular HTML without WebGL, without layout reflow in the hot path, and without sacrificing accessibility, SEO, or crawlability.

If you need 3D feeling in UI but do not want a canvas scene, this library gives you DOM depth, physical shadows, depth hover, and z-scroll with a small declarative API.

## Installation

```bash
npm install spatial-web
```

## What problem does it solve?

Most web UIs fake depth with isolated tricks:

- `translateZ()` without semantic scene rules
- hardcoded shadows that ignore the light source
- hover effects that only toggle on or off
- scroll experiences that need custom one-off math

`spatial-web` solves those problems with one runtime model for:

- semantic Z-axis layout for DOM elements
- physical shadow projection from a 3D light
- continuous pointer-driven depth interaction
- z-scroll for storytelling, cards, dashboards, and layered UI

## When to use `spatial-web`

Use it when you want:

- depth in the DOM without WebGL
- physical shadows for regular HTML cards
- layered dashboards and panels
- scrollytelling with z-axis movement
- semantic depth hover for panels, tooltips, and inspectors

Do not use it if you need:

- meshes, cameras, materials, or full 3D engines
- game rendering
- complex scene graphs better handled by WebGL or Three.js

## Why it is different

- regular HTML stays readable by screen readers and crawlers
- no canvas scene required
- shadows come from light + element position, not manual art direction
- the same scene can combine layout, hover, scroll, and lighting
- the runtime is tiny and dependency-free

## Demos

Clone the repo, run:

```bash
npm install
npm run build
npm run dev
```

Then open `demos/index.html` from the local server.

Important: `dist/` is not committed to the repo. If you clone the project and want to open the demos locally, the build step is mandatory before the demos can load `spatial-web.iife.js`.

Core demos:

- `basic-depth`: perspective and semantic Z-axis layout
- `z-scroll`: wheel mapped to depth
- `depth-hover`: continuous pointer response
- `physical-shadow`: shadow projection from a 3D light
- `comparison`: hacks vs semantic spatial layout
- `playground`: live controls and generated code

Problem-oriented examples:

- `cards-depth-stack`: layered feature cards without WebGL
- `dashboard-layers`: dashboard panels with semantic depth
- `scrollytelling-z-flow`: narrative blocks moving through Z space

Framework-oriented examples:

- `examples/react-feature-cards.tsx`: React feature cards with depth hover and light
- `examples/next-dashboard-scene.tsx`: Next.js client component for layered dashboards
- `examples/next-scrollytelling-z.tsx`: Next.js client component for z-scroll storytelling

## Quick start

```html
<div id="scene">
  <article data-depth="-120">Back plane</article>
  <article data-depth="0">Base plane</article>
  <article data-depth="180">Front plane</article>
</div>

<script type="module">
  import { DepthLayout } from 'spatial-web'

  const scene = new DepthLayout('#scene', {
    perspective: 1000,
    depthRange: [-300, 300]
  })

  scene.enableDepthHover({
    responseRange: 80,
    velocityFactor: 0.4,
    returnEasing: 'spring'
  })

  scene.setLight({
    x: 180,
    y: -120,
    z: 600,
    intensity: 1.3
  })
</script>
```

## API

### `DepthLayout`

Reads `data-depth` from child elements and projects them in a consistent 3D scene:

```ts
import { DepthLayout } from 'spatial-web'

const scene = new DepthLayout('#scene', {
  perspective: 1000,
  depthRange: [-300, 300]
})
```

### `enableDepthHover`

Adds continuous depth response based on pointer position and velocity:

```ts
scene.enableDepthHover({
  responseRange: 80,
  velocityFactor: 0.4,
  returnEasing: 'spring'
})
```

### `enableDepthScroll`

Maps scroll into the Z axis:

```ts
scene.enableDepthScroll({
  axis: 'mixed',
  speed: 0.45,
  easing: 'spring'
})
```

### `setLight`

Projects box shadows from a declared 3D light:

```ts
scene.setLight({
  x: 180,
  y: -120,
  z: 600,
  intensity: 1.3
})
```

## Default options

These are the runtime defaults if you omit configuration:

- `DepthLayout`: `perspective: 1000`, `depthRange: [-300, 300]`, `autoUpdate: true`
- `enableDepthHover`: `responseRange: 80`, `velocityFactor: 0.4`, `returnEasing: 'spring'`
- `enableDepthScroll`: `axis: 'mixed'`, `speed: 0.8`, `easing: 'spring'`
- `setLight`: `intensity: 1`

## `spatial-web` vs `translateZ()`

Plain CSS `translateZ()` can move a single element in 3D, but it does not give you a scene model.

- `translateZ()` is a visual transform only; `spatial-web` adds scene-level depth rules
- `translateZ()` does not solve hover math, scroll mapping, or dynamic scene updates
- CSS shadows are manual styling; `spatial-web` projects them from a declared light
- `translateZ()` is enough for isolated effects; `spatial-web` is for coordinated layered interfaces

## Keywords

This project is especially relevant if you are searching for:

- DOM depth library
- semantic z-axis layout
- 3D layout without WebGL
- physical shadows for DOM elements
- depth hover UI
- z-scroll JavaScript library
- layered UI cards without Three.js

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

Generated artifacts:

- `dist/spatial-web.js`
- `dist/spatial-web.iife.js`
- `dist/index.d.ts`

## Release check

```bash
npm run typecheck
npm run build
npm run pack:check
```

## Repo structure

- `src/`: TypeScript runtime
- `demos/`: interactive examples
- `examples/`: React and Next copy-paste examples
- `dist/`: generated bundles

## Current status

This repo implements the `Spatial Web Layout Primitive` MVP: a small dependency-free runtime designed to prove that spatial layout can live inside the traditional DOM with a simple declarative API.
