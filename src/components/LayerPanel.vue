<script setup lang="ts">
import { computed } from "vue";
import type { LayerConfig } from "@/types/layer";
import { normalizeUrl } from "@/utils/url";
import { TextField } from "@phila/phila-ui-text-field";
import { Icon } from "@phila/phila-ui-core";
import { faCircleInfo, faFilter } from "@fortawesome/pro-solid-svg-icons";
import LayerStatusIndicators from "./LayerStatusIndicators.vue";
import LayerOpacitySlider from "./LayerOpacitySlider.vue";
import LayerLegend from "./LayerLegend.vue";
import { useLayerState } from "@/composables/useLayerState";

// Props with configuration options
const props = withDefaults(
  defineProps<{
    /** Array of layer configurations with component type */
    layerList: Array<{ config: LayerConfig; component: string }>;
    /** Set of currently visible layer IDs */
    visibleLayers: Set<string>;
    /** Map of layer IDs to opacity values (0-1) */
    layerOpacities: Record<string, number>;
    /** Set of layer IDs currently loading */
    loadingLayers: Set<string>;
    /** Map of layer IDs to error messages */
    layerErrors: Record<string, string>;
    /** Current map zoom level */
    currentZoom: number;
    /** Current search query */
    searchQuery: string;
    /** Map of layer URLs to metadata page URLs */
    layerMetadata: Record<string, string>;
    /** Display mode: 'flat' for simple list, 'topics' for accordion grouping */
    mode?: "flat" | "topics";
    /** Whether to show the search box */
    showSearch?: boolean;
    /** Whether to show opacity sliders */
    showOpacity?: boolean;
    /** Whether to show legends */
    showLegend?: boolean;
    /** Placeholder text for search input */
    searchPlaceholder?: string;
  }>(),
  {
    mode: "flat",
    showSearch: true,
    showOpacity: true,
    showLegend: true,
    searchPlaceholder: "Filter layers...",
  },
);

// Emit events for layer changes
// Note: Vue converts @kebab-case listeners to camelCase, so we emit camelCase
const emit = defineEmits<{
  /** Emitted when a layer's visibility is toggled */
  (e: "toggleLayer", layerId: string): void;
  /** Emitted when a layer's opacity is changed */
  (e: "setOpacity", layerId: string, opacity: number): void;
  /** Emitted when the search query changes */
  (e: "updateSearch", query: string): void;
}>();

// Filtered layer list based on search query
const filteredLayerList = computed(() => {
  if (!props.searchQuery.trim()) {
    return props.layerList;
  }
  const query = props.searchQuery.toLowerCase();
  return props.layerList.filter(layer => layer.config.title.toLowerCase().includes(query));
});

// Get metadata URL for a layer (if available)
function getMetadataUrl(layerUrl: string): string | null {
  const normalized = normalizeUrl(layerUrl);
  return props.layerMetadata[normalized] || null;
}

// Check if any layer in the list has metadata (to reserve space for info icons)
const anyLayerHasMetadata = computed(() => {
  return props.layerList.some(layer => getMetadataUrl(layer.config.url));
});

const { isVisible, getLayerOpacity, isLayerLoading, getLayerError, isLayerAvailableAtZoom } = useLayerState(() => ({
  visibleLayerIds: props.visibleLayers,
  layerOpacities: props.layerOpacities,
  loadingLayerIds: props.loadingLayers,
  layerErrors: props.layerErrors,
  currentZoom: props.currentZoom,
}));

// Computed for v-model binding with TextField
const searchValue = computed({
  get: () => props.searchQuery,
  set: (value: string) => emit("updateSearch", value),
});

function onToggleLayer(layerId: string) {
  emit("toggleLayer", layerId);
}


</script>

<template>
  <div class="layer-panel">
    <!-- Search box (configurable) -->
    <div v-if="showSearch" class="search-box">
      <TextField v-model="searchValue" :placeholder="searchPlaceholder" class-name="layer-search-field">
        <template #trailing-action>
          <Icon :icon-definition="faFilter" size="small" inline decorative />
        </template>
      </TextField>
    </div>

    <!-- Topics mode: render slot content -->
    <div v-if="mode === 'topics'" class="topics-container">
      <slot name="topics">
        <!-- Default: show message if no topics provided -->
        <div class="no-topics">
          No topic components provided. Use the "topics" slot to add TopicAccordion components.
        </div>
      </slot>
    </div>

    <!-- Flat mode: render layer list -->
    <div v-else class="layer-list" :class="{ 'has-metadata': anyLayerHasMetadata }">
      <div v-for="layer in filteredLayerList" :key="layer.config.id" class="layer-item">
        <div class="layer-row">
          <!-- Info icon (metadata link) - shows if this layer has metadata, or placeholder if any layer has metadata -->
          <a
            v-if="getMetadataUrl(layer.config.url)"
            :href="getMetadataUrl(layer.config.url) || ''"
            target="_blank"
            rel="noopener noreferrer"
            class="metadata-link"
            :aria-label="'View metadata for ' + layer.config.title"
            @click.stop
          >
            <Icon :icon-definition="faCircleInfo" size="small" inline decorative />
          </a>
          <span v-else-if="anyLayerHasMetadata" class="metadata-placeholder"></span>

          <label
            class="layer-checkbox"
            :class="{
              'layer-unavailable': !isLayerAvailableAtZoom(layer.config),
              'layer-error': getLayerError(layer.config.id),
            }"
          >
            <input
              type="checkbox"
              :checked="isVisible(layer.config.id)"
              :disabled="!isLayerAvailableAtZoom(layer.config)"
              @change="onToggleLayer(layer.config.id)"
            />
            <span class="layer-title">
              {{ layer.config.title }}
              <LayerStatusIndicators
                :loading="isLayerLoading(layer.config.id)"
                :error="getLayerError(layer.config.id)"
                :unavailable="!isLayerAvailableAtZoom(layer.config)"
              />
            </span>
          </label>
        </div>

        <LayerOpacitySlider
          v-if="showOpacity && isVisible(layer.config.id) && isLayerAvailableAtZoom(layer.config)"
          :layer-id="layer.config.id"
          :layer-name="layer.config.title"
          :opacity="getLayerOpacity(layer.config.id)"
          @update:opacity="emit('setOpacity', layer.config.id, $event)"
        />

        <LayerLegend
          v-if="showLegend && isVisible(layer.config.id) && isLayerAvailableAtZoom(layer.config) && layer.config.legend?.length"
          :items="layer.config.legend"
          :label="'Legend for ' + layer.config.title"
        />
      </div>

      <div v-if="filteredLayerList.length === 0" class="no-results">No layers match "{{ searchQuery }}"</div>
    </div>
  </div>
</template>

<style scoped>
.layer-panel {
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Search box styles */
.search-box {
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}

.search-box :deep(.phila-input) {
  width: 100%;
}

.search-box :deep(.phila-text-field) {
  width: 100% !important;
}

/*
 * COMPACT TEXT FIELD OVERRIDES
 *
 * The phila-ui TextField has a standard height of 56px designed for form inputs.
 * In the layerboard sidebar, we intentionally use a more compact version to save
 * vertical space. These overrides remove extra padding/gaps while preserving the
 * component's visual design.
 *
 * Standard TextField height breakdown:
 *   - .state-layer padding: 4px top + 4px bottom
 *   - .content height: var(--dimension-core-600) + 4px padding top/bottom
 *   Total: ~56px
 *
 * Compact version reduces this to ~40px by removing the extra padding layers.
 */
.search-box :deep(.state-layer) {
  padding-top: 0;
  padding-bottom: 0;
}

.search-box :deep(.content) {
  padding-top: 0;
  padding-bottom: 0;
}

/* Topics container for accordion mode */
.topics-container {
  flex: 1;
  overflow-y: auto;
}

.no-topics {
  padding: 16px;
  text-align: center;
  color: #666;
  font-style: italic;
}

.layer-list {
  padding: 8px 16px;
  flex: 1;
  overflow-y: auto;
}

/* Layer row - contains info icon and checkbox/label */
.layer-row {
  display: flex;
  align-items: center;
}

/* Metadata info icon link */
.metadata-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  min-height: 24px;
  color: var(--Schemes-On-Surface, #000);
  flex-shrink: 0;
  align-self: center;
}

.metadata-link:focus-visible {
  outline: 2px solid #0f4d90;
  outline-offset: 2px;
}

/* Placeholder to maintain alignment when layer has no metadata but others do */
.metadata-placeholder {
  width: 24px;
  min-height: 24px;
  flex-shrink: 0;
  align-self: center;
}

.layer-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  cursor: pointer;
  font-size: 16px;
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
  align-self: center;
}

.layer-checkbox input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.layer-checkbox input[type="checkbox"]:focus-visible {
  outline: 2px solid #0f4d90;
  outline-offset: 2px;
}

.layer-title {
  line-height: 1.4;
  flex: 1;
}

/* Unavailable layer styles (zoom range) */
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

:deep(.opacity-control) {
  padding: 4px 8px 12px 40px;
}

.has-metadata :deep(.opacity-control) {
  padding-left: 64px;
}

/* No results message */
.no-results {
  padding: 16px;
  text-align: center;
  color: #666;
  font-style: italic;
}

:deep(.layer-legend) {
  padding: 4px 8px 8px 40px;
  margin: 0 0 8px 0;
}

.has-metadata :deep(.layer-legend) {
  padding-left: 64px;
}
</style>
