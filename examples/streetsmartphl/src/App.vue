<script setup lang="ts">
// StreetSmartPHL Example App
// Demonstrates topic-based accordion mode - a full working app with map and layers

import { ref, computed, onMounted } from 'vue'
import "@phila/phila-ui-map-core/dist/assets/phila-ui-map-core.css"

import MapPanel from '@/components/MapPanel.vue'
import TopicAccordion from '@/components/TopicAccordion.vue'
import LayerCheckboxSet from '@/components/LayerCheckboxSet.vue'
import type { CyclomediaConfig, PictometryCredentials } from "@phila/phila-ui-map-core"

import { getLayerConfigs } from '@/services/layerConfigService'
import type { LayerConfig } from '@/types/layer'

// ============================================================================
// TOPIC CONFIGURATION
// ============================================================================
// Define which layers belong to each topic
// These layer IDs come from the WebMap and are grouped by topic

// Infrastructure & Streets topic - layers related to road infrastructure
const infrastructureLayerIds = [
  'Street Centerline',
  'Bike Network',
  'Sidewalks',
]

// Property & Zoning topic - layers related to parcels and zoning
const propertyLayerIds = [
  'Zoning Overlays',
  'Commercial Corridors',
  'PWD Parcels',
]

// Environment topic - layers related to water, environment
const environmentLayerIds = [
  'Combined Sewer Service Area',
  'Stormwater Service Area',
]

// All topic layer IDs combined (for filtering)
const allTopicLayerIds = [
  ...infrastructureLayerIds,
  ...propertyLayerIds,
  ...environmentLayerIds,
]

// ============================================================================
// LAYER DEFINITIONS
// ============================================================================
const layerList = ref<Array<{ config: LayerConfig; component: string }>>([])
const configsLoading = ref(true)
const configsError = ref<string | null>(null)

async function loadLayerConfigs() {
  try {
    configsLoading.value = true
    configsError.value = null

    const configs = await getLayerConfigs()

    // Build layerList from configs array
    layerList.value = configs.map(config => ({
      config,
      component: config.type,
    }))

    // Initialize layer opacities
    const initialOpacities: Record<string, number> = {}
    configs.forEach(config => {
      initialOpacities[config.id] = config.opacity ?? 1.0
    })
    layerOpacities.value = initialOpacities

    console.log(`[StreetSmartPHL] Loaded ${configs.length} layer configs`)
  } catch (error) {
    console.error('[StreetSmartPHL] Failed to load layer configs:', error)
    configsError.value = error instanceof Error ? error.message : 'Failed to load layer configurations'
  } finally {
    configsLoading.value = false
  }
}

// ============================================================================
// SHARED STATE
// ============================================================================
const currentZoom = ref(12)
const visibleLayers = ref<Set<string>>(new Set())
const layerOpacities = ref<Record<string, number>>({})
const loadingLayers = ref<Set<string>>(new Set())
const layerErrors = ref<Record<string, string>>({})

// Track expanded state for accordions
const expandedTopics = ref<Set<string>>(new Set(['infrastructure'])) // Start with one expanded

// ============================================================================
// CYCLOMEDIA CONFIGURATION
// ============================================================================
const cyclomediaConfig: CyclomediaConfig = {
  username: import.meta.env.VITE_CYCLOMEDIA_USERNAME || "",
  password: import.meta.env.VITE_CYCLOMEDIA_PASSWORD || "",
  apiKey: import.meta.env.VITE_CYCLOMEDIA_API_KEY || "",
  srs: "EPSG:4326",
  locale: "en-US",
}

// ============================================================================
// PICTOMETRY CONFIGURATION
// ============================================================================
const pictometryCredentials: PictometryCredentials = {
  clientId: import.meta.env.VITE_PICTOMETRY_CLIENT_ID || "",
  clientSecret: import.meta.env.VITE_PICTOMETRY_CLIENT_SECRET || "",
}

// ============================================================================
// COMPUTED - LAYERS BY TOPIC
// ============================================================================
function getLayersForTopic(layerIds: string[]): LayerConfig[] {
  return layerList.value
    .filter(layer => layerIds.includes(layer.config.id))
    .map(layer => layer.config)
}

const infrastructureLayers = computed(() => getLayersForTopic(infrastructureLayerIds))
const propertyLayers = computed(() => getLayersForTopic(propertyLayerIds))
const environmentLayers = computed(() => getLayersForTopic(environmentLayerIds))

// ============================================================================
// EVENT HANDLERS
// ============================================================================
function onZoomChange(zoom: number) {
  currentZoom.value = zoom
}

function toggleLayer(layerId: string) {
  if (visibleLayers.value.has(layerId)) {
    visibleLayers.value.delete(layerId)
  } else {
    visibleLayers.value.add(layerId)
  }
  visibleLayers.value = new Set(visibleLayers.value)
}

function setLayerOpacity(layerId: string, opacity: number) {
  layerOpacities.value = { ...layerOpacities.value, [layerId]: opacity }
}

function setLayerLoading(layerId: string, loading: boolean) {
  if (loading) {
    loadingLayers.value.add(layerId)
  } else {
    loadingLayers.value.delete(layerId)
  }
  loadingLayers.value = new Set(loadingLayers.value)
}

function setLayerError(layerId: string, error: string | null) {
  if (error) {
    layerErrors.value = { ...layerErrors.value, [layerId]: error }
  } else {
    const { [layerId]: _, ...rest } = layerErrors.value
    layerErrors.value = rest
  }
}

function onTopicToggle(topicId: string, expanded: boolean) {
  if (expanded) {
    expandedTopics.value.add(topicId)
  } else {
    expandedTopics.value.delete(topicId)
  }
  expandedTopics.value = new Set(expandedTopics.value)
}

// ============================================================================
// MOBILE PANEL TOGGLE
// ============================================================================
const activePanel = ref<"topics" | "map">("map")

function togglePanel() {
  activePanel.value = activePanel.value === "topics" ? "map" : "topics"
}

onMounted(() => {
  loadLayerConfigs()
})
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <h1>StreetSmartPHL</h1>
      <span class="subtitle">Streets Department Interactive Map</span>
    </header>

    <div class="app-main">
      <!-- Loading state -->
      <div v-if="configsLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading layer configurations...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="configsError" class="error-container">
        <h2>Error Loading Layers</h2>
        <p>{{ configsError }}</p>
        <button @click="loadLayerConfigs" class="retry-button">Retry</button>
      </div>

      <!-- Normal app view -->
      <template v-else>
        <!-- Topics Panel (Sidebar with accordions) -->
        <aside class="topics-panel" :class="{ 'active': activePanel === 'topics' }">
          <div class="topics-container">
            <!-- Infrastructure & Streets Topic -->
            <TopicAccordion
              title="Infrastructure & Streets"
              :expanded="expandedTopics.has('infrastructure')"
              :layer-ids="infrastructureLayerIds"
              @toggle="(expanded) => onTopicToggle('infrastructure', expanded)"
            >
              <LayerCheckboxSet
                :layers="infrastructureLayers"
                :visible-layer-ids="visibleLayers"
                :layer-opacities="layerOpacities"
                :loading-layer-ids="loadingLayers"
                :layer-errors="layerErrors"
                :current-zoom="currentZoom"
                :show-opacity="true"
                :show-legend="true"
                @toggle-layer="toggleLayer"
                @set-opacity="setLayerOpacity"
              />
              <p v-if="infrastructureLayers.length === 0" class="no-layers">
                No matching layers found
              </p>
            </TopicAccordion>

            <!-- Property & Zoning Topic -->
            <TopicAccordion
              title="Property & Zoning"
              :expanded="expandedTopics.has('property')"
              :layer-ids="propertyLayerIds"
              @toggle="(expanded) => onTopicToggle('property', expanded)"
            >
              <LayerCheckboxSet
                :layers="propertyLayers"
                :visible-layer-ids="visibleLayers"
                :layer-opacities="layerOpacities"
                :loading-layer-ids="loadingLayers"
                :layer-errors="layerErrors"
                :current-zoom="currentZoom"
                :show-opacity="true"
                :show-legend="true"
                @toggle-layer="toggleLayer"
                @set-opacity="setLayerOpacity"
              />
              <p v-if="propertyLayers.length === 0" class="no-layers">
                No matching layers found
              </p>
            </TopicAccordion>

            <!-- Environment Topic -->
            <TopicAccordion
              title="Environment & Water"
              :expanded="expandedTopics.has('environment')"
              :layer-ids="environmentLayerIds"
              @toggle="(expanded) => onTopicToggle('environment', expanded)"
            >
              <LayerCheckboxSet
                :layers="environmentLayers"
                :visible-layer-ids="visibleLayers"
                :layer-opacities="layerOpacities"
                :loading-layer-ids="loadingLayers"
                :layer-errors="layerErrors"
                :current-zoom="currentZoom"
                :show-opacity="true"
                :show-legend="true"
                @toggle-layer="toggleLayer"
                @set-opacity="setLayerOpacity"
              />
              <p v-if="environmentLayers.length === 0" class="no-layers">
                No matching layers found
              </p>
            </TopicAccordion>
          </div>
        </aside>

        <!-- Map Panel -->
        <div class="map-panel-wrapper" :class="{ 'active': activePanel === 'map' }">
          <MapPanel
            :visible-layers="visibleLayers"
            :layer-opacities="layerOpacities"
            :layer-list="layerList"
            :cyclomedia-config="cyclomediaConfig"
            :pictometry-credentials="pictometryCredentials"
            @zoom="onZoomChange"
            @layer-loading="setLayerLoading"
            @layer-error="setLayerError"
          />
        </div>
      </template>
    </div>

    <!-- Mobile toggle button -->
    <button class="mobile-toggle" @click="togglePanel">
      <span v-if="activePanel === 'map'">Topics</span>
      <span v-else>Map</span>
    </button>

    <footer class="app-footer">
      City of Philadelphia - Streets Department
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  overflow: hidden;
}

html {
  overflow: hidden;
}
</style>

<!-- Popup styles (unscoped for MapLibre) -->
<style>
.popup-content {
  font-size: 14px;
  min-width: 200px;
}

.popup-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2176d2;
}

.popup-table {
  width: 100%;
  border-collapse: collapse;
}

.popup-table th,
.popup-table td {
  padding: 4px 8px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.popup-table th {
  font-weight: 600;
  color: #666;
  width: 40%;
}

.popup-table td {
  color: #333;
}

.popup-no-fields {
  color: #666;
  font-style: italic;
  margin: 8px 0;
}

.popup-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
}

.popup-nav-info {
  font-size: 12px;
  color: #666;
}
</style>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.app-header {
  background-color: #2176d2;
  color: white;
  padding: 10px 20px;
  flex-shrink: 0;
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.app-header h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.subtitle {
  font-size: 14px;
  opacity: 0.9;
}

.app-main {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.topics-panel {
  width: 320px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  flex-shrink: 0;
}

.topics-container {
  padding: 0;
}

.no-layers {
  padding: 12px 16px;
  color: #666;
  font-style: italic;
  font-size: 14px;
}

.map-panel-wrapper {
  flex: 1;
  position: relative;
}

.app-footer {
  background-color: #2176d2;
  color: white;
  padding: 10px 20px;
  flex-shrink: 0;
  font-size: 14px;
}

/* Mobile toggle button - hidden on desktop */
.mobile-toggle {
  display: none;
  position: fixed;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  background-color: #2176d2;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.mobile-toggle:hover {
  background-color: #1565c0;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .app-main {
    position: relative;
  }

  .topics-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: none;
    border-right: none;
  }

  .topics-panel.active {
    display: block;
  }

  .map-panel-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
  }

  .map-panel-wrapper.active {
    display: block;
  }

  .mobile-toggle {
    display: block;
  }
}

/* Loading and error states */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 40px;
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2176d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.error-container h2 {
  color: #d32f2f;
  font-size: 24px;
  margin-bottom: 16px;
}

.error-container p {
  color: #666;
  font-size: 16px;
  margin-bottom: 24px;
  max-width: 500px;
}

.retry-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  background-color: #2176d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-button:hover {
  background-color: #1565c0;
}
</style>
