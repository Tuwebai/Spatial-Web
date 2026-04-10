import type { LightSource, SceneItemState } from '../types';
interface PhysicalShadowBindings {
    getContainerMetrics: () => {
        width: number;
        height: number;
    };
    items: SceneItemState[];
    depthRange: [number, number];
}
export declare class PhysicalShadow {
    private readonly bindings;
    private light;
    constructor(bindings: PhysicalShadowBindings);
    setLight(light: LightSource): void;
    apply(): void;
}
export {};
