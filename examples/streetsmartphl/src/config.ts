import type { LayerboardConfig } from '@/types'

/**
 * StreetSmartPHL configuration
 *
 * This example demonstrates topic-based accordion mode.
 * Replace the webMapId with an actual StreetSmartPHL WebMap ID
 * and populate the layer IDs with actual layer IDs from that WebMap.
 */
export const config: LayerboardConfig = {
  // TODO: Replace with actual StreetSmartPHL WebMap ID
  // For demo purposes, using the OpenMaps WebMap ID
  webMapId: '376af635c84643cd816a8c5d017a53aa',
  mode: 'dynamic',
  panelMode: 'topics',
  topics: [
    {
      id: 'pave',
      title: 'Paving',
      layerIds: paveLayerIds,
      defaultExpanded: false,
    },
    {
      id: 'plow',
      title: 'Snow Plowing',
      layerIds: plowLayerIds,
      defaultExpanded: false,
    },
  ],
}

/**
 * Layer IDs for the Paving topic
 * These would typically be layer IDs from a StreetSmartPHL-specific WebMap
 * For demo purposes, using some layer IDs from OpenMaps WebMap
 */
export const paveLayerIds: string[] = [
  // TODO: Replace with actual paving-related layer IDs
  // Example layer IDs from OpenMaps (for demonstration):
  'paving-projects',
  'street-centerlines',
]

/**
 * Layer IDs for the Snow Plowing topic
 * These would typically be layer IDs from a StreetSmartPHL-specific WebMap
 */
export const plowLayerIds: string[] = [
  // TODO: Replace with actual snow plowing-related layer IDs
  // Example layer IDs:
  'snow-plow-routes',
  'salt-storage-facilities',
]
