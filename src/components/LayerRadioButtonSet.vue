<script setup lang="ts">
// LayerRadioButtonSet.vue - Radio button layer selection (only one visible at a time)
// Used for mutually exclusive layer visibility (e.g., PavePHL paving status layers)
//
// Supports per-layer display options from LayerConfig.displayOptions:
// - shouldShowSlider: false hides the opacity slider
// - shouldShowLegendBox: false hides the legend
// - layerNameChange: overrides the display label

import type { LayerConfig } from "@/types/layer";
import { shouldShowSlider, shouldShowLegendBox, getLayerDisplayName } from "@/utils/layer-display";
import LayerStatusIndicators from "./LayerStatusIndicators.vue";
import LayerOpacitySlider from "./LayerOpacitySlider.vue";
import LayerLegend from "./LayerLegend.vue";
import { useLayerState } from "@/composables/useLayerState";

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
    groupLabel: undefined,
  },
);

const emit = defineEmits<{
  /** Emitted when a layer is selected (turn on) and others should be turned off */
  (e: "selectLayer", layerId: string, previousLayerIds: string[]): void;
  /** Emitted when a layer's opacity is changed */
  (e: "setOpacity", layerId: string, opacity: number): void;
}>();

const { isVisible, getLayerOpacity, isLayerLoading, getLayerError, isLayerAvailableAtZoom } = useLayerState(
  () => props,
);

function onSelectLayer(layerId: string) {
  // Find all currently visible layers in this set to turn off
  const previousLayerIds = props.layers.filter(l => props.visibleLayerIds.has(l.id) && l.id !== layerId).map(l => l.id);
  emit("selectLayer", layerId, previousLayerIds);
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
          <LayerStatusIndicators
            :loading="isLayerLoading(layer.id)"
            :error="getLayerError(layer.id)"
            :unavailable="!isLayerAvailableAtZoom(layer)"
          />
        </span>
      </label>

      <LayerOpacitySlider
        v-if="shouldShowSlider(layer, showOpacity) && isVisible(layer.id) && isLayerAvailableAtZoom(layer)"
        :layer-id="layer.id"
        :layer-name="getLayerDisplayName(layer)"
        :opacity="getLayerOpacity(layer.id)"
        @update:opacity="emit('setOpacity', layer.id, $event)"
      />

      <LayerLegend
        v-if="
          shouldShowLegendBox(layer, showLegend) &&
          isVisible(layer.id) &&
          isLayerAvailableAtZoom(layer) &&
          layer.legend?.length
        "
        :items="layer.legend"
        :label="'Legend for ' + getLayerDisplayName(layer)"
      />
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

/* Error indicator */
.layer-error {
  color: #c00;
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
