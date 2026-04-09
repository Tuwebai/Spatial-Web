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
  const offsetX = round(projectedX - elementPos.x)
  const offsetY = round(projectedY - elementPos.y)
  const heightAbovePlane = Math.max(24, elementPos.z - planeZ)
  const lightDistance = Math.hypot(elementPos.x - lightPos.x, elementPos.y - lightPos.y, elementPos.z - lightPos.z)
  const blur = round(Math.max(28, heightAbovePlane * 0.16 + lightDistance * 0.04) * intensity)
  const spread = round(Math.max(-12, -heightAbovePlane * 0.02))
  const ambientOpacity = Math.max(0.12, Math.min(0.32, (1 / (1 + lightDistance / 520)) * 0.34 * intensity))
  const coreOpacity = Math.max(0.18, Math.min(0.48, (1 / (1 + heightAbovePlane / 360)) * 0.52 * intensity))
  const contactBlur = round(Math.max(8, blur * 0.28))
  const contactOffsetX = round(offsetX * 0.35)
  const contactOffsetY = round(offsetY * 0.35)

  return [
    `${offsetX}px ${offsetY}px ${blur}px ${spread}px rgba(3, 6, 12, ${round(ambientOpacity)})`,
    `${contactOffsetX}px ${contactOffsetY}px ${contactBlur}px ${round(spread * 0.35)}px rgba(0, 0, 0, ${round(coreOpacity)})`
  ].join(', ')
}
