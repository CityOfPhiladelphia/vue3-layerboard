import type { LayerConfig } from "@/types/layer";

interface LayerStateProps {
  visibleLayerIds: Set<string>;
  layerOpacities: Record<string, number>;
  loadingLayerIds: Set<string>;
  layerErrors: Record<string, string>;
  currentZoom: number;
}

export function useLayerState(getProps: () => LayerStateProps) {
  function isVisible(layerId: string): boolean {
    return getProps().visibleLayerIds.has(layerId);
  }

  function getLayerOpacity(layerId: string): number {
    return getProps().layerOpacities[layerId] ?? 1;
  }

  function isLayerLoading(layerId: string): boolean {
    return getProps().loadingLayerIds.has(layerId);
  }

  function getLayerError(layerId: string): string | null {
    return getProps().layerErrors[layerId] || null;
  }

  function isLayerAvailableAtZoom(config: LayerConfig): boolean {
    const zoom = getProps().currentZoom;
    const minZoom = config.minZoom;
    const maxZoom = config.maxZoom;
    if (minZoom !== undefined && zoom < minZoom) return false;
    if (maxZoom !== undefined && zoom > maxZoom) return false;
    return true;
  }

  return { isVisible, getLayerOpacity, isLayerLoading, getLayerError, isLayerAvailableAtZoom };
}
