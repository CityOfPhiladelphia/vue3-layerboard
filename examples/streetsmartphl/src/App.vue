<script setup lang="ts">
/**
 * StreetSmartPHL Example App
 *
 * Demonstrates custom sidebar usage with the Layerboard framework:
 * - Uses topic accordions instead of default flat layer panel
 * - Groups layers by topic (PickupPHL, PermitPHL, PavePHL, PlowPHL, SweepPHL)
 */

import { ref } from 'vue'
import Layerboard from '@/components/Layerboard.vue'
import TopicAccordion from '@/components/TopicAccordion.vue'
import LayerCheckboxSet from '@/components/LayerCheckboxSet.vue'
import type { CyclomediaConfig, PictometryCredentials } from "@phila/phila-ui-map-core"
import type { LayerConfig } from '@/types/layer'

// ============================================================================
// WEBMAP CONFIGURATION
// ============================================================================
// StreetSmartPHL WebMap IDs from the real application
// Production: 'bf08ea4ce7194f68934a7150567151ae'
// Staging: '67fd6b584c50413b807fc6d3a39bbed7'
const WEBMAP_ID = '67fd6b584c50413b807fc6d3a39bbed7'

// ============================================================================
// TOPIC CONFIGURATION
// ============================================================================
// Define which layers belong to each topic
// These layer titles come from the actual StreetSmartPHL WebMap

// PickupPHL topic - Sanitation collection and visits
const pickupLayerIds = [
  'Sanitation Visits - Close',
  'Sanitation Visits - Intermediate',
  'Sanitation Visits - Far',
  'CollectionBoundary',
]

// PermitPHL topic - Street closure permits
const permitLayerIds = [
  'Current Closures (points)',
  'Current Closures (segments)',
  'Future Closures (points)',
  'Future Closures (segments)',
]

// PavePHL topic - Paving and road conditions
const paveLayerIds = [
  'Streets Status for Paving Season',
  'Street Condition Index',
  'Five Year Paving Plan',
  'Highway Districts',
  'Council Districts',
  'State Routes',
]

// PlowPHL topic - Snow removal and winter operations
const plowLayerIds = [
  'Treated Street Status',
  'Streets not treated by the City',
]

// SweepPHL topic - Street sweeping
const sweepLayerIds = [
  'All Route Locations',
  'Swept Streets',
  '2022 Litter Index',
]

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
// TOPIC ACCORDION STATE
// ============================================================================
const expandedTopics = ref<Set<string>>(new Set(['pickup']))

function onTopicToggle(topicId: string, expanded: boolean) {
  if (expanded) {
    expandedTopics.value.add(topicId)
  } else {
    expandedTopics.value.delete(topicId)
  }
  expandedTopics.value = new Set(expandedTopics.value)
}

// ============================================================================
// HELPER - FILTER LAYERS BY TOPIC
// ============================================================================
function getLayersForTopic(
  layers: Array<{ config: LayerConfig; component: string }>,
  layerIds: string[]
): LayerConfig[] {
  return layers
    .filter(layer => layerIds.includes(layer.config.id))
    .map(layer => layer.config)
}
</script>

<template>
  <Layerboard
    title="StreetSmartPHL"
    subtitle="Streets Department Interactive Map"
    :web-map-id="WEBMAP_ID"
    theme-color="#2176d2"
    sidebar-width="30%"
    sidebar-label="Topics"
    :show-default-sidebar="false"
    :cyclomedia-config="cyclomediaConfig"
    :pictometry-credentials="pictometryCredentials"
  >
    <!-- Custom sidebar with topic accordions -->
    <template #sidebar="{ layers, visibleLayers, layerOpacities, loadingLayers, layerErrors, currentZoom, toggleLayer, setOpacity }">
      <div class="topics-container">
        <!-- PickupPHL Topic -->
        <TopicAccordion
          title="PickupPHL"
          icon="trash-alt"
          :expanded="expandedTopics.has('pickup')"
          :layer-ids="pickupLayerIds"
          @toggle="(expanded) => onTopicToggle('pickup', expanded)"
        >
          <LayerCheckboxSet
            :layers="getLayersForTopic(layers, pickupLayerIds)"
            :visible-layer-ids="visibleLayers"
            :layer-opacities="layerOpacities"
            :loading-layer-ids="loadingLayers"
            :layer-errors="layerErrors"
            :current-zoom="currentZoom"
            :show-opacity="true"
            :show-legend="true"
            @toggle-layer="toggleLayer"
            @set-opacity="setOpacity"
          />
          <p v-if="getLayersForTopic(layers, pickupLayerIds).length === 0" class="no-layers">
            No matching layers found
          </p>
        </TopicAccordion>

        <!-- PermitPHL Topic -->
        <TopicAccordion
          title="PermitPHL"
          icon="scroll"
          :expanded="expandedTopics.has('permit')"
          :layer-ids="permitLayerIds"
          @toggle="(expanded) => onTopicToggle('permit', expanded)"
        >
          <LayerCheckboxSet
            :layers="getLayersForTopic(layers, permitLayerIds)"
            :visible-layer-ids="visibleLayers"
            :layer-opacities="layerOpacities"
            :loading-layer-ids="loadingLayers"
            :layer-errors="layerErrors"
            :current-zoom="currentZoom"
            :show-opacity="true"
            :show-legend="true"
            @toggle-layer="toggleLayer"
            @set-opacity="setOpacity"
          />
          <p v-if="getLayersForTopic(layers, permitLayerIds).length === 0" class="no-layers">
            No matching layers found
          </p>
        </TopicAccordion>

        <!-- PavePHL Topic -->
        <TopicAccordion
          title="PavePHL"
          icon="road"
          :expanded="expandedTopics.has('pave')"
          :layer-ids="paveLayerIds"
          @toggle="(expanded) => onTopicToggle('pave', expanded)"
        >
          <LayerCheckboxSet
            :layers="getLayersForTopic(layers, paveLayerIds)"
            :visible-layer-ids="visibleLayers"
            :layer-opacities="layerOpacities"
            :loading-layer-ids="loadingLayers"
            :layer-errors="layerErrors"
            :current-zoom="currentZoom"
            :show-opacity="true"
            :show-legend="true"
            @toggle-layer="toggleLayer"
            @set-opacity="setOpacity"
          />
          <p v-if="getLayersForTopic(layers, paveLayerIds).length === 0" class="no-layers">
            No matching layers found
          </p>
        </TopicAccordion>

        <!-- PlowPHL Topic -->
        <TopicAccordion
          title="PlowPHL"
          icon="snowflake"
          :expanded="expandedTopics.has('plow')"
          :layer-ids="plowLayerIds"
          @toggle="(expanded) => onTopicToggle('plow', expanded)"
        >
          <LayerCheckboxSet
            :layers="getLayersForTopic(layers, plowLayerIds)"
            :visible-layer-ids="visibleLayers"
            :layer-opacities="layerOpacities"
            :loading-layer-ids="loadingLayers"
            :layer-errors="layerErrors"
            :current-zoom="currentZoom"
            :show-opacity="true"
            :show-legend="true"
            @toggle-layer="toggleLayer"
            @set-opacity="setOpacity"
          />
          <p v-if="getLayersForTopic(layers, plowLayerIds).length === 0" class="no-layers">
            No matching layers found
          </p>
        </TopicAccordion>

        <!-- SweepPHL Topic -->
        <TopicAccordion
          title="SweepPHL"
          icon="broom"
          :expanded="expandedTopics.has('sweep')"
          :layer-ids="sweepLayerIds"
          @toggle="(expanded) => onTopicToggle('sweep', expanded)"
        >
          <LayerCheckboxSet
            :layers="getLayersForTopic(layers, sweepLayerIds)"
            :visible-layer-ids="visibleLayers"
            :layer-opacities="layerOpacities"
            :loading-layer-ids="loadingLayers"
            :layer-errors="layerErrors"
            :current-zoom="currentZoom"
            :show-opacity="true"
            :show-legend="true"
            @toggle-layer="toggleLayer"
            @set-opacity="setOpacity"
          />
          <p v-if="getLayersForTopic(layers, sweepLayerIds).length === 0" class="no-layers">
            No matching layers found
          </p>
        </TopicAccordion>
      </div>
    </template>

    <!-- Custom footer -->
    <template #footer>
      City of Philadelphia - Streets Department
    </template>
  </Layerboard>
</template>

<style scoped>
.topics-container {
  padding: 0;
}

.no-layers {
  padding: 12px 16px;
  color: #666;
  font-style: italic;
  font-size: 14px;
}
</style>
