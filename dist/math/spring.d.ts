import type { SpringState } from '../types';
export interface SpringTickResult {
    value: number;
    velocity: number;
}
export interface SpringController {
    tick(target: number, current: number, velocity: number, dt: number): SpringTickResult;
}
export declare function createSpring(stiffness?: number, damping?: number): SpringController;
export declare function isSpringSettled(state: SpringState, threshold?: number): boolean;
