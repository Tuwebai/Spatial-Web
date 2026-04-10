import type { DepthHoverOptions, DepthLayoutOptions, DepthScrollOptions, LightSource, SceneSnapshot } from '../types';
export declare class DepthLayout {
    private readonly container;
    private readonly options;
    private readonly items;
    private readonly shadowModule;
    private containerMetrics;
    private resizeObserver;
    private mutationObserver;
    private hoverModule;
    private scrollModule;
    private light;
    private frameId;
    private lastFrameTime;
    private renderQueued;
    private readonly requestRenderBound;
    constructor(selector: string, options?: DepthLayoutOptions);
    enableDepthScroll(options?: DepthScrollOptions): void;
    enableDepthHover(options?: DepthHoverOptions): void;
    setLight(light: LightSource): void;
    getSnapshot(): SceneSnapshot;
    destroy(): void;
    refresh(): void;
    private measure;
    private syncItems;
    private requestRender;
    private render;
}
