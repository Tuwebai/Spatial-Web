import type { SceneItemState, SpringState } from '../types';
export declare function computePointerVelocity(currentX: number, currentY: number, previousX: number, previousY: number, elapsedMs: number): number;
export declare function computeHoverTarget(item: SceneItemState, pointerX: number, pointerY: number, responseRange: number, velocityFactor: number, velocity: number): number;
export declare function createSpringState(): SpringState;
