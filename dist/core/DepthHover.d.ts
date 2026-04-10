import type { DepthHoverOptions, SceneItemState } from '../types';
interface DepthHoverBindings {
    container: HTMLElement;
    getContainerMetrics: () => {
        left: number;
        top: number;
    };
    items: SceneItemState[];
    requestRender: () => void;
}
export declare class DepthHover {
    private readonly bindings;
    private readonly config;
    private readonly spring;
    private readonly states;
    private lastX;
    private lastY;
    private lastTime;
    private readonly onMoveBound;
    private readonly onLeaveBound;
    private readonly onEnterBound;
    constructor(bindings: DepthHoverBindings, options?: DepthHoverOptions);
    destroy(): void;
    update(dt: number): boolean;
    private onPointerMove;
    private resetTargets;
    private getState;
}
export {};
