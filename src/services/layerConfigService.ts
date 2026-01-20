/**
 * Layer Configuration Service
 *
 * Handles loading layer configurations dynamically from ArcGIS Online WebMap.
 * Fetches Esri WebMap JSON at runtime and transforms it to LayerConfig format.
 */

import type { LayerConfig } from '@/types/layer';
import { transformWebMapToLayerConfigs, type EsriWebMap } from '@/utils/webmap-transformer';

/**
 * The Esri WebMap ID for the OpenMaps application
 * This is a public ID used to fetch the layer configuration from ArcGIS Online
 */
export const WEBMAP_ID = '376af635c84643cd816a8c5d017a53aa';

/**
 * Builds the fetch URL for the Esri WebMap JSON
 * @param webMapId The Esri WebMap ID
 * @returns The full URL to fetch the WebMap data
 */
export function buildWebMapUrl(webMapId: string): string {
  return `https://www.arcgis.com/sharing/rest/content/items/${webMapId}/data?f=json`;
}

/**
 * Gets the WebMap fetch URL using the default WEBMAP_ID
 */
export function getWebMapUrl(): string {
  return buildWebMapUrl(WEBMAP_ID);
}

// ============================================================================
// CACHING & STATE
// ============================================================================

/**
 * In-memory cache for transformed layer configs
 * Prevents re-fetching and re-transforming on subsequent calls
 */
let cachedConfigs: LayerConfig[] | null = null;

/**
 * Loading state to prevent concurrent fetches
 */
let loadingPromise: Promise<LayerConfig[]> | null = null;

/**
 * Clear the cached layer configs
 * Useful for testing or forcing a refresh
 */
export function clearCache(): void {
  cachedConfigs = null;
  loadingPromise = null;
}

// ============================================================================
// LAYER CONFIG LOADING
// ============================================================================

/**
 * Fetch WebMap JSON from ArcGIS Online
 * @returns Promise resolving to the WebMap JSON object
 * @throws Error if fetch fails
 */
async function fetchWebMapJson(): Promise<EsriWebMap> {
  const url = getWebMapUrl();

  console.log(`[LayerConfigService] Fetching WebMap from: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch WebMap: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json as EsriWebMap;
}

/**
 * Load layer configs dynamically
 * Fetches WebMap JSON and transforms it at runtime
 */
async function loadDynamicConfigs(): Promise<LayerConfig[]> {
  try {
    console.log('[LayerConfigService] Loading configs in DYNAMIC mode');

    // Fetch WebMap JSON
    const webMapJson = await fetchWebMapJson();

    // Transform to layer configs
    console.log('[LayerConfigService] Transforming WebMap to layer configs');
    const configs = await transformWebMapToLayerConfigs(webMapJson);

    console.log(`[LayerConfigService] Successfully loaded ${configs.length} layer configs`);

    return configs;
  } catch (error) {
    console.error('[LayerConfigService] Error loading dynamic configs:', error);
    throw new Error(`Failed to load dynamic layer configs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Gets layer configurations by fetching from ArcGIS Online WebMap
 *
 * This function:
 * - Fetches WebMap JSON and transforms it at runtime
 * - Caches results in memory to avoid redundant fetches/transforms
 * - Prevents concurrent loads with a loading promise guard
 *
 * @returns Promise resolving to an array of LayerConfig objects
 * @throws Error if fetch or transform fails
 */
export async function getLayerConfigs(): Promise<LayerConfig[]> {
  // Return cached configs if available
  if (cachedConfigs) {
    console.log('[LayerConfigService] ⚠️ Returning CACHED configs (transformer will NOT run)');
    console.log('[LayerConfigService] To force refresh, call clearCache() or reload with Ctrl+Shift+R');
    return cachedConfigs;
  }

  // If already loading, return the existing promise
  if (loadingPromise) {
    console.log('[LayerConfigService] Load already in progress, waiting...');
    return loadingPromise;
  }

  console.log('[LayerConfigService] Mode: dynamic');

  // Create loading promise
  loadingPromise = (async () => {
    try {
      const configs = await loadDynamicConfigs();

      // Cache the results
      cachedConfigs = configs;

      return configs;
    } finally {
      // Clear loading promise when done (success or error)
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}
