import type { LayerConfig } from "@/types/layer";

/**
 * Whether to show a checkbox for this layer.
 * Defaults to true unless displayOptions.shouldShowCheckbox is explicitly false.
 */
export function shouldShowCheckbox(config: LayerConfig): boolean {
  return config.displayOptions?.shouldShowCheckbox !== false;
}

/**
 * Whether to show an opacity slider for this layer.
 * Respects both the component-level `showOpacity` prop and per-layer override.
 */
export function shouldShowSlider(config: LayerConfig, componentShowOpacity: boolean): boolean {
  if (!componentShowOpacity) return false;
  return config.displayOptions?.shouldShowSlider !== false;
}

/**
 * Whether to show the legend for this layer.
 * Respects both the component-level `showLegend` prop and per-layer override.
 */
export function shouldShowLegendBox(config: LayerConfig, componentShowLegend: boolean): boolean {
  if (!componentShowLegend) return false;
  return config.displayOptions?.shouldShowLegendBox !== false;
}

/**
 * Get the display name for a layer, using layerNameChange override if set.
 */
export function getLayerDisplayName(config: LayerConfig): string {
  return config.displayOptions?.layerNameChange || config.title;
}
