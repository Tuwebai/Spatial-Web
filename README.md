# Spatial Web

Pure JavaScript/TypeScript library for semantic depth layout on the DOM. `spatial-web` adds a real Z dimension to regular HTML without WebGL, without layout reflow in the hot path, and without sacrificing accessibility, SEO, or crawlability.

Instead of hand-authoring `translateZ()`, fake perspective, and invented shadows, you declare `data-depth` and let the runtime compute spatial projection, pointer response, z-scroll, and light-driven shadows from a consistent scene model.

## Installation

```bash
npm install spatial-web
```

Mientras el paquete no esté publicado en npm, el flujo real sigue siendo clonar este repo y ejecutar `npm install` dentro de `proyecto-Spatial-Web/`.

## Demos

Cloná el repo, corré:

```bash
npm install
npm run dev
```

Después abrí `demos/index.html` desde el servidor local.

Demos incluidas:

- `basic-depth`: perspectiva y lectura del eje Z
- `z-scroll`: navegación por profundidad con wheel
- `depth-hover`: respuesta continua al puntero
- `physical-shadow`: sombra proyectada desde una luz 3D
- `comparison`: contraste entre hacks manuales y layout semántico
- `playground`: escena interactiva con controles en vivo

## API

`spatial-web` cubre cuatro capacidades del MVP:

### 1. Depth layout

Declarás profundidad en HTML y el runtime proyecta cada plano en el viewport:

```html
<div id="scene">
  <article data-depth="-120">Back plane</article>
  <article data-depth="0">Base plane</article>
  <article data-depth="180">Front plane</article>
</div>
```

```ts
import { DepthLayout } from 'spatial-web'

const scene = new DepthLayout('#scene', {
  perspective: 1000,
  depthRange: [-300, 300]
})
```

### 2. Depth hover

El puntero no activa estados binarios. Empuja o retrae elementos como una respuesta espacial continua:

```ts
scene.enableDepthHover({
  responseRange: 80,
  velocityFactor: 0.4,
  returnEasing: 'spring'
})
```

### 3. Z-scroll

El wheel puede mapearse al eje Z de la escena:

```ts
scene.enableDepthScroll({
  axis: 'mixed',
  speed: 0.45,
  easing: 'spring'
})
```

### 4. Physical shadow

Las sombras salen de una luz 3D declarada, no de valores visuales inventados a mano:

```ts
scene.setLight({
  x: 180,
  y: -120,
  z: 600,
  intensity: 1.3
})
```

## Why this exists

La web ya resuelve layout en X e Y, pero no ofrece una dimensión Z semántica y utilizable a nivel DOM. `spatial-web` explora esa pieza faltante con un runtime pequeño, declarativo y compatible con la web real.

Esto permite:

- profundidad consistente entre elementos sin hacks visuales aislados
- hover y scroll espaciales reutilizables
- sombras coherentes con la posición real del elemento
- escenas interactivas sin migrar a WebGL

## Principles

- zero dependencies
- declarativo primero
- sin reflow en el hot path
- DOM semántico intacto
- tree-shakeable
- progressive enhancement

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

Artefactos generados:

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

- `src/`: runtime TypeScript
- `demos/`: ejemplos interactivos
- `dist/`: bundles generados

## Current status

Este repo implementa el MVP de `Spatial Web Layout Primitive`: una librería pequeña, sin dependencias, orientada a validar que el layout espacial puede vivir dentro del DOM tradicional con una API simple y una experiencia de desarrollo clara.
