# Spatial Web

Open source layout runtime para agregar profundidad semántica al DOM usando una dimensión Z real, sin WebGL y sin romper accesibilidad.

La propuesta de `spatial-web` es simple: el developer declara profundidad en HTML y el runtime resuelve perspectiva, escala, hover espacial, z-scroll y sombras calculadas desde la posición 3D del elemento.

## Qué resuelve

- agrega layout en eje Z sin convertir la UI en una escena 3D pesada
- mantiene HTML, SEO y accesibilidad intactos
- evita hacks manuales de `translateZ()` y `box-shadow`
- permite interacciones espaciales declarativas sobre elementos normales del DOM

## Principios

- open source y zero dependencies
- declarativo first
- semántica del DOM intacta
- performance orientada a runtime pequeño
- progressive enhancement sobre web estándar

## Módulos del MVP

- `DepthLayout`: aplica perspectiva y transform espacial según `data-depth`
- `DepthScroll`: mapea scroll al eje Z de la escena
- `DepthHover`: responde a posición y velocidad del puntero con profundidad continua
- `PhysicalShadow`: calcula sombras a partir de una luz 3D declarada

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Esto levanta el bundle IIFE para trabajar las demos locales.

## Build

```bash
npm run build
```

Artefactos generados:

- `dist/spatial-web.js`
- `dist/spatial-web.iife.js`
- `dist/index.d.ts`

## Uso básico

```html
<div id="scene">
  <article data-depth="-120">Foreground</article>
  <article data-depth="0">Base plane</article>
  <article data-depth="180">Background</article>
</div>

<script type="module">
  import { DepthLayout } from './dist/spatial-web.js'

  const scene = new DepthLayout('#scene', {
    perspective: 1000,
    depthRange: [-300, 300]
  })

  scene.enableDepthHover({
    responseRange: 80,
    velocityFactor: 0.4
  })
</script>
```

## Demos

- `demos/index.html`: índice de demos
- `demos/basic-depth.html`: lectura base de profundidad y perspectiva
- `demos/z-scroll.html`: navegación sobre eje Z con wheel
- `demos/depth-hover.html`: respuesta espacial al puntero
- `demos/physical-shadow.html`: sombra proyectada desde luz 3D
- `demos/comparison.html`: comparación visual de módulos
- `demos/playground.html`: playground interactivo con controles y codigo generado

## Estructura del repo

- `src/`: runtime TypeScript
- `demos/`: ejemplos interactivos del MVP
- `dist/`: bundles generados

## Estado actual

Este repo implementa el MVP de `Spatial Web Layout Primitive`: una librería pequeña, sin dependencias, centrada en probar que el layout espacial puede existir dentro del DOM tradicional con una API declarativa y una experiencia de desarrollo simple.
