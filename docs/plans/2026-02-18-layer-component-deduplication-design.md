# Layer Component Deduplication (C1)

_2026-02-18 | bead 43y_

## Problem

LayerCheckboxSet, LayerRadioButtonSet, and LayerPanel share ~185 lines of duplicated helper functions, template blocks, and CSS. Changes to opacity sliders, legends, or status indicators must be made in three places.

## Approach

Extract sub-components and a composable. Each parent keeps its selection mechanism and layout.

## Extractions

### 1. `useLayerState` composable (`src/composables/useLayerState.ts`)

Takes common props (visibleLayerIds, layerOpacities, loadingLayerIds, layerErrors, currentZoom) and returns: `isVisible()`, `getLayerOpacity()`, `isLayerLoading()`, `getLayerError()`, `isLayerAvailableAtZoom()`.

### 2. `LayerStatusIndicators.vue` (`src/components/LayerStatusIndicators.vue`)

Loading spinner + error badge + zoom indicator. Props: `loading: boolean`, `error: string | null`, `unavailable: boolean`. Used inside each parent's layer title span.

### 3. `LayerOpacitySlider.vue` (`src/components/LayerOpacitySlider.vue`)

Opacity label + range input. Props: `layerId: string`, `layerName: string`, `opacity: number`. Emits: `update:opacity`. Parents wrap in v-if for visibility/zoom checks.

### 4. `LayerLegend.vue` (`src/components/LayerLegend.vue`)

Legend `<ul>` with circle/line/fill symbols. Props: `items: LegendItem[]`, `label: string`. Parents wrap in v-if for visibility/legend checks.

## What stays in parents

- Selection UI (checkbox / radio / flat+metadata)
- Layer iteration loop
- v-if conditions for showing slider/legend
- Unique features (LayerPanel search/metadata/topics, LayerCheckboxSet shouldShowCheckbox)

## CSS ownership

- Status indicator styles -> LayerStatusIndicators
- Opacity styles -> LayerOpacitySlider
- Legend symbol styles -> LayerLegend
- Selection and layout styles -> each parent
