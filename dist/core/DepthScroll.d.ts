import type { DepthScrollOptions, SceneItemState } from '../types';
interface DepthScrollBindings {
    container: HTMLElement;
    items: SceneItemState[];
    depthRange: [number, number];
    requestRender: () => void;
}
export declare class DepthScroll {
    private readonly bindings;
    private readonly config;
    private readonly spring;
    private readonly states;
    private readonly onWheelBound;
    constructor(bindings: DepthScrollBindings, options?: DepthScrollOptions);
    destroy(): void;
    update(dt: number): boolean;
    private onWheel;
    private getState;
}
export {};
