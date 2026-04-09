import type { Vec3 } from '../types'

function round(value: number): number {
  return Math.round(value * 100) / 100
}

export function computeBoxShadow(elementPos: Vec3, lightPos: Vec3, intensity: number, planeZ = -320): string {
  const lightToElementZ = elementPos.z - lightPos.z
  const safeLightToElementZ = Math.abs(lightToElementZ) < 0.001 ? -0.001 : lightToElementZ
  const projectionFactor = (planeZ - lightPos.z) / safeLightToElementZ
  const projectedX = lightPos.x + (elementPos.x - lightPos.x) * projectionFactor
  const projectedY = lightPos.y + (elementPos.y - lightPos.y) * projectionFactor
  const rawOffsetX = projectedX - elementPos.x
  const rawOffsetY = projectedY - elementPos.y
  const heightAbovePlane = Math.max(24, elementPos.z - planeZ)
  const lightDistance = Math.hypot(elementPos.x - lightPos.x, elementPos.y - lightPos.y, elementPos.z - lightPos.z)
  const offsetLimit = Math.max(28, heightAbovePlane * 0.42)
  const offsetX = round(Math.max(-offsetLimit, Math.min(offsetLimit, rawOffsetX * 0.34)))
  const offsetY = round(Math.max(-offsetLimit, Math.min(offsetLimit, rawOffsetY * 0.34)))
  const blur = round(Math.max(22, heightAbovePlane * 0.12 + lightDistance * 0.025) * (0.88 + intensity * 0.18))
  const spread = round(Math.max(0, heightAbovePlane * 0.012))
  const ambientOpacity = Math.max(0.12, Math.min(0.24, (1 / (1 + lightDistance / 520)) * 0.24 * intensity))
  const coreOpacity = Math.max(0.16, Math.min(0.28, (1 / (1 + heightAbovePlane / 360)) * 0.3 * intensity))
  const contactBlur = round(Math.max(10, blur * 0.38))
  const contactSpread = round(Math.max(0, spread * 0.65 + 2))
  const contactOffsetX = round(offsetX * 0.45)
  const contactOffsetY = round(offsetY * 0.45)

  return [
    `${offsetX}px ${offsetY}px ${blur}px ${spread}px rgba(4, 8, 16, ${round(ambientOpacity)})`,
    `${contactOffsetX}px ${contactOffsetY}px ${contactBlur}px ${contactSpread}px rgba(2, 4, 10, ${round(coreOpacity)})`
  ].join(', ')
}
