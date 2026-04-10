import type { ContainerMetrics, SceneItemState } from '../types';
export declare function prepareSceneItemElement(element: HTMLElement): void;
export declare function resetSceneItemElement(element: HTMLElement): void;
export declare function createSceneItem(element: HTMLElement): SceneItemState;
export declare function collectSceneItems(container: HTMLElement): SceneItemState[];
export declare function measureSceneItems(containerMetrics: ContainerMetrics, items: SceneItemState[]): void;
