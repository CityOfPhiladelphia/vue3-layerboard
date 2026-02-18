<script setup lang="ts">
// LayerCheckboxSet.vue - Reusable layer toggle checkboxes
// Can be used standalone or within TopicAccordion
//
// Supports per-layer display options from LayerConfig.displayOptions:
// - shouldShowCheckbox: false hides the checkbox (layer is auto-controlled)
// - shouldShowSlider: false hides the opacity slider
// - shouldShowLegendBox: false hides the legend
// - layerNameChange: overrides the display label

import type { LayerConfig } from "@/types/layer";
import { shouldShowCheckbox, shouldShowSlider, shouldShowLegendBox, getLayerDisplayName } from "@/utils/layer-display";
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
    groupLabel: undefined,
  },
);

const emit = defineEmits<{
  /** Emitted when a layer's visibility is toggled */
  (e: "toggleLayer", layerId: string): void;
  /** Emitted when a layer's opacity is changed */
  (e: "setOpacity", layerId: string, opacity: number): void;
}>();

const { isVisible, getLayerOpacity, isLayerLoading, getLayerError, isLayerAvailableAtZoom } = useLayerState(
  () => props,
);

function onToggleLayer(layerId: string) {
  emit("toggleLayer", layerId);
}
</script>

<template>
  <fieldset class="layer-checkbox-set" role="group" :aria-label="groupLabel">
    <div v-for="layer in layers" :key="layer.id" class="layer-item">
      <!-- Layer WITH checkbox (default behavior) -->
      <label
        v-if="shouldShowCheckbox(layer)"
        class="layer-checkbox"
        :class="{
          'layer-unavailable': !isLayerAvailableAtZoom(layer),
          'layer-error': getLayerError(layer.id),
        }"
      >
        <input
          type="checkbox"
          :checked="isVisible(layer.id)"
          :disabled="!isLayerAvailableAtZoom(layer)"
          @change="onToggleLayer(layer.id)"
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

      <!-- Layer WITHOUT checkbox (auto-controlled, just shows label) -->
      <div
        v-else
        class="layer-label-only"
        :class="{
          'layer-unavailable': !isLayerAvailableAtZoom(layer),
          'layer-error': getLayerError(layer.id),
        }"
      >
        <span class="layer-title">
          {{ getLayerDisplayName(layer) }}
          <LayerStatusIndicators
            :loading="isLayerLoading(layer.id)"
            :error="getLayerError(layer.id)"
            :unavailable="!isLayerAvailableAtZoom(layer)"
          />
        </span>
      </div>

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
  </fieldset>
</template>

<style scoped>
.layer-checkbox-set {
  display: flex;
  flex-direction: column;
  border: none;
  margin: 0;
  padding: 0;
}

.layer-item {
  border-bottom: 1px solid #eee;
}

.layer-item:last-child {
  border-bottom: none;
}

.layer-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.layer-checkbox:hover {
  background-color: #f5f5f5;
}

.layer-checkbox input[type="checkbox"] {
  width: 24px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
  margin: 0;
}

.layer-checkbox input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.layer-checkbox input[type="checkbox"]:focus-visible {
  outline: 2px solid #0f4d90;
  outline-offset: 2px;
}

/* Layer label without checkbox (auto-controlled layers) */
.layer-label-only {
  display: flex;
  align-items: center;
  padding: 10px 8px;
  font-size: 14px;
  color: #333;
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
