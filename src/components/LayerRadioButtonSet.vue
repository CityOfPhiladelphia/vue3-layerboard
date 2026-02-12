<script setup lang="ts">
// LayerRadioButtonSet.vue - Radio button layer selection (only one visible at a time)
// Used for mutually exclusive layer visibility (e.g., PavePHL paving status layers)
//
// Supports per-layer display options from LayerConfig.displayOptions:
// - shouldShowSlider: false hides the opacity slider
// - shouldShowLegendBox: false hides the legend
// - layerNameChange: overrides the display label

import type { LayerConfig } from "@/types/layer";

const props = withDefaults(
  defineProps<{
    /** Array of layer configurations to display */
    layers: LayerConfig[];
    /** Set of currently visible layer IDs */
    visibleLayerIds: Set<string>;
    /** Map of layer IDs to opacity values (0-1) */
    layerOpacities?: Record<string, number>;
    /** Set of layer IDs currently loading */
    loadingLayerIds?: Set<string>;
    /** Map of layer IDs to error messages */
    layerErrors?: Record<string, string>;
    /** Current map zoom level (for zoom-based availability) */
    currentZoom?: number;
    /** Whether to show opacity sliders (can be overridden per-layer) */
    showOpacity?: boolean;
    /** Whether to show legends (can be overridden per-layer) */
    showLegend?: boolean;
    /** Unique name for the radio button group */
    groupName?: string;
    /** Accessible label for the group */
    groupLabel?: string;
  }>(),
  {
    layerOpacities: () => ({}),
    loadingLayerIds: () => new Set(),
    layerErrors: () => ({}),
    currentZoom: 12,
    showOpacity: true,
    showLegend: true,
    groupName: "layer-radio-group",
  },
);

const emit = defineEmits<{
  /** Emitted when a layer is selected (turn on) and others should be turned off */
  (e: "selectLayer", layerId: string, previousLayerIds: string[]): void;
  /** Emitted when a layer's opacity is changed */
  (e: "setOpacity", layerId: string, opacity: number): void;
}>();

// Helper functions for visibility and state
function isVisible(layerId: string): boolean {
  return props.visibleLayerIds.has(layerId);
}

function getLayerOpacity(layerId: string): number {
  return props.layerOpacities[layerId] ?? 1;
}

function isLayerLoading(layerId: string): boolean {
  return props.loadingLayerIds.has(layerId);
}

function getLayerError(layerId: string): string | null {
  return props.layerErrors[layerId] || null;
}

function isLayerAvailableAtZoom(config: LayerConfig): boolean {
  const zoom = props.currentZoom;
  const minZoom = config.minZoom;
  const maxZoom = config.maxZoom;
  if (minZoom !== undefined && zoom < minZoom) return false;
  if (maxZoom !== undefined && zoom > maxZoom) return false;
  return true;
}

// Helper functions for display options
function shouldShowSlider(config: LayerConfig): boolean {
  // Check both component prop and per-layer option
  if (!props.showOpacity) return false;
  return config.displayOptions?.shouldShowSlider !== false;
}

function shouldShowLegendBox(config: LayerConfig): boolean {
  // Check both component prop and per-layer option
  if (!props.showLegend) return false;
  return config.displayOptions?.shouldShowLegendBox !== false;
}

function getLayerDisplayName(config: LayerConfig): string {
  // Use layerNameChange if provided, otherwise use title
  return config.displayOptions?.layerNameChange || config.title;
}

function onSelectLayer(layerId: string) {
  // Find all currently visible layers in this set to turn off
  const previousLayerIds = props.layers.filter(l => props.visibleLayerIds.has(l.id) && l.id !== layerId).map(l => l.id);
  emit("selectLayer", layerId, previousLayerIds);
}

function onOpacityChange(layerId: string, event: Event) {
  const input = event.target as HTMLInputElement;
  emit("setOpacity", layerId, parseFloat(input.value));
}
</script>

<template>
  <div class="layer-radio-set" role="radiogroup" :aria-label="groupLabel">
    <div v-for="layer in layers" :key="layer.id" class="layer-item">
      <!-- Radio button for layer selection -->
      <label
        class="layer-radio"
        :class="{
          'layer-unavailable': !isLayerAvailableAtZoom(layer),
          'layer-error': getLayerError(layer.id),
        }"
      >
        <input
          type="radio"
          :name="groupName"
          :checked="isVisible(layer.id)"
          :disabled="!isLayerAvailableAtZoom(layer)"
          @change="onSelectLayer(layer.id)"
        />
        <span class="layer-title">
          {{ getLayerDisplayName(layer) }}
          <span v-if="isLayerLoading(layer.id)" class="loading-indicator" role="status"> Loading... </span>
          <span
            v-if="getLayerError(layer.id)"
            class="error-indicator"
            :aria-label="getLayerError(layer.id) || 'Error'"
            role="status"
          >
            Error
          </span>
          <span v-if="!isLayerAvailableAtZoom(layer)" class="zoom-indicator"> (zoom in) </span>
        </span>
      </label>

      <!-- Opacity slider (respects per-layer shouldShowSlider) -->
      <div v-if="shouldShowSlider(layer) && isVisible(layer.id)" class="opacity-control">
        <label class="opacity-label" :for="'opacity-' + layer.id">
          Opacity: {{ Math.round(getLayerOpacity(layer.id) * 100) }}%
        </label>
        <input
          :id="'opacity-' + layer.id"
          type="range"
          min="0"
          max="1"
          step="0.05"
          :value="getLayerOpacity(layer.id)"
          :aria-label="'Opacity for ' + getLayerDisplayName(layer)"
          class="opacity-slider"
          @input="onOpacityChange(layer.id, $event)"
        />
      </div>

      <!-- Legend (respects per-layer shouldShowLegendBox) -->
      <ul
        v-if="shouldShowLegendBox(layer) && isVisible(layer.id) && layer.legend?.length"
        class="layer-legend"
        :aria-label="'Legend for ' + getLayerDisplayName(layer)"
      >
        <li v-for="(item, index) in layer.legend" :key="index" class="legend-item">
          <!-- Circle symbol -->
          <span
            v-if="item.type === 'circle'"
            class="legend-symbol legend-circle"
            :style="{ backgroundColor: item.color }"
            aria-hidden="true"
          ></span>

          <!-- Line symbol -->
          <span
            v-else-if="item.type === 'line'"
            class="legend-symbol legend-line"
            :style="{
              backgroundColor: item.color,
              height: `${item.width || 2}px`,
            }"
            aria-hidden="true"
          ></span>

          <!-- Fill symbol -->
          <span
            v-else-if="item.type === 'fill'"
            class="legend-symbol legend-fill"
            :style="{ backgroundColor: item.color }"
            aria-hidden="true"
          ></span>

          <span class="legend-label">{{ item.label }}</span>
        </li>
      </ul>
    </div>

    <!-- Empty state -->
    <div v-if="layers.length === 0" class="empty-state">No layers available</div>
  </div>
</template>

<style scoped>
.layer-radio-set {
  display: flex;
  flex-direction: column;
}

.layer-item {
  border-bottom: 1px solid #eee;
}

.layer-item:last-child {
  border-bottom: none;
}

.layer-radio {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.layer-radio:hover {
  background-color: #f5f5f5;
}

.layer-radio input[type="radio"] {
  width: 24px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
  margin: 0;
}

.layer-radio input[type="radio"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.layer-radio input[type="radio"]:focus-visible {
  outline: 2px solid #0f4d90;
  outline-offset: 2px;
}

.layer-title {
  line-height: 1.4;
  flex: 1;
}

/* Unavailable layer styles */
.layer-unavailable {
  color: #767676;
  cursor: not-allowed;
}

.layer-unavailable:hover {
  background-color: transparent;
}

.zoom-indicator {
  font-size: 11px;
  color: #767676;
  font-style: italic;
  margin-left: 4px;
}

/* Loading indicator */
.loading-indicator {
  font-size: 13px;
  color: #0f4d90;
  font-style: italic;
  margin-left: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.loading-indicator::before {
  content: "";
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 2px solid #0f4d90;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error indicator */
.layer-error {
  color: #c00;
}

.error-indicator {
  font-size: 11px;
  color: #c00;
  font-weight: bold;
  margin-left: 4px;
}

/* Opacity control */
.opacity-control {
  padding: 4px 8px 8px 36px;
}

.opacity-label {
  font-size: 11px;
  color: #666;
  display: block;
  margin-bottom: 4px;
}

.opacity-slider {
  width: 100%;
  height: 4px;
  cursor: pointer;
}

.opacity-slider:focus-visible {
  outline: 2px solid #0f4d90;
  outline-offset: 2px;
}

/* Legend styles */
.layer-legend {
  list-style: none;
  margin: 0;
  padding: 4px 8px 8px 36px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
}

.legend-symbol {
  flex-shrink: 0;
}

.legend-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-line {
  width: 20px;
  min-height: 2px;
  border-radius: 1px;
}

.legend-fill {
  width: 14px;
  height: 14px;
  border: 1px solid #666;
}

.legend-label {
  font-size: 12px;
  color: #555;
}

/* Empty state */
.empty-state {
  padding: 16px;
  text-align: center;
  color: #666;
  font-style: italic;
  font-size: 14px;
}
</style>
