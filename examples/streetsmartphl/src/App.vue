<script setup lang="ts">
// StreetSmartPHL Example App
// Demonstrates topic-based accordion mode with TopicAccordion and LayerCheckboxSet

import { ref, onMounted } from 'vue'
import TopicAccordion from '@/components/TopicAccordion.vue'
import LayerCheckboxSet from '@/components/LayerCheckboxSet.vue'
import { useLayerboard } from '@/composables'
import { config, paveLayerIds, plowLayerIds } from './config'
import type { LayerConfig } from '@/types/layer'

// Use the layerboard composable for state management
const {
  layerConfigs,
  visibleLayers,
  layerOpacities,
  loadingLayers,
  layerErrors,
  isLoading,
  error,
  initialize,
  toggleLayer,
  setLayerOpacity,
} = useLayerboard(config)

// Track expanded state for accordions
const expandedTopics = ref<Set<string>>(new Set())

// Filter layers by topic
function getLayersForTopic(layerIds: string[]): LayerConfig[] {
  return layerConfigs.value.filter(layer => layerIds.includes(layer.id))
}

// Toggle accordion
function onTopicToggle(topicId: string, expanded: boolean) {
  if (expanded) {
    expandedTopics.value.add(topicId)
  } else {
    expandedTopics.value.delete(topicId)
  }
  expandedTopics.value = new Set(expandedTopics.value)
}

// Handle layer toggle from checkbox set
function onToggleLayer(layerId: string) {
  toggleLayer(layerId)
}

// Handle opacity change from checkbox set
function onSetOpacity(layerId: string, opacity: number) {
  setLayerOpacity(layerId, opacity)
}

onMounted(() => {
  initialize()
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
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading layer configurations...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <h2>Error Loading Layers</h2>
        <p>{{ error.message }}</p>
        <button @click="initialize" class="retry-button">Retry</button>
      </div>

      <!-- Normal app view -->
      <template v-else>
        <!-- Topics Panel (Sidebar) -->
        <aside class="topics-panel">
          <div class="topics-container">
            <!-- Paving Topic -->
            <TopicAccordion
              title="Paving"
              :expanded="expandedTopics.has('pave')"
              :layer-ids="paveLayerIds"
              @toggle="(expanded) => onTopicToggle('pave', expanded)"
            >
              <LayerCheckboxSet
                :layers="getLayersForTopic(paveLayerIds)"
                :visible-layer-ids="visibleLayers"
                :layer-opacities="layerOpacities"
                :loading-layer-ids="loadingLayers"
                :layer-errors="layerErrors"
                :show-opacity="true"
                :show-legend="true"
                @toggle-layer="onToggleLayer"
                @set-opacity="onSetOpacity"
              />
            </TopicAccordion>

            <!-- Snow Plowing Topic -->
            <TopicAccordion
              title="Snow Plowing"
              :expanded="expandedTopics.has('plow')"
              :layer-ids="plowLayerIds"
              @toggle="(expanded) => onTopicToggle('plow', expanded)"
            >
              <LayerCheckboxSet
                :layers="getLayersForTopic(plowLayerIds)"
                :visible-layer-ids="visibleLayers"
                :layer-opacities="layerOpacities"
                :loading-layer-ids="loadingLayers"
                :layer-errors="layerErrors"
                :show-opacity="true"
                :show-legend="true"
                @toggle-layer="onToggleLayer"
                @set-opacity="onSetOpacity"
              />
            </TopicAccordion>
          </div>
        </aside>

        <!-- Map Panel -->
        <div class="map-panel-wrapper">
          <p class="placeholder-message">
            Map panel would go here.<br/>
            This example demonstrates the topics accordion UI pattern.
          </p>
        </div>
      </template>
    </div>

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

.map-panel-wrapper {
  flex: 1;
  position: relative;
  background-color: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-message {
  text-align: center;
  color: #666;
  font-size: 16px;
  line-height: 1.6;
}

.app-footer {
  background-color: #2176d2;
  color: white;
  padding: 10px 20px;
  flex-shrink: 0;
  font-size: 14px;
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

.error-container h2 {
  color: #d32f2f;
  margin-bottom: 16px;
}

.retry-button {
  padding: 12px 24px;
  font-size: 16px;
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
