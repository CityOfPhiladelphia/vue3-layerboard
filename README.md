# @phila/layerboard

A Vue 3 component framework for building interactive map applications powered by ArcGIS Online WebMaps and MapLibre GL JS. Provide a WebMap ID and get a full mapping app with layer management, popups, legends, search, and more.

## Live Examples

- [OpenMaps](https://openmaps.phila.gov) — flat layer list (all layers searchable)
- [StreetSmartPHL](https://streetsmartphl.phila.gov) — topic-based layout (layers grouped in accordions)

## Installation

```sh
pnpm add @phila/layerboard
```

### Peer Dependencies

```sh
pnpm add vue pinia maplibre-gl @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/vue-fontawesome
```

## Quick Start

```vue
<template>
  <Layerboard
    title="My Map App"
    web-map-id="1596df70df0349e293ceec46a06ccc50"
  />
</template>

<script setup>
import { Layerboard } from "@phila/layerboard";
import "@phila/layerboard/dist/layerboard.css";
</script>
```

This renders a full-screen map app with a sidebar listing all layers from the WebMap, complete with legends, opacity sliders, search, popups, and mobile responsiveness.

## Layout Modes

### Flat Mode (default)

All layers in a searchable list. Set `show-default-sidebar` to `true` (default) and the built-in `LayerPanel` renders in the sidebar.

### Topics Mode

Group layers into collapsible accordions using the sidebar slot:

```vue
<Layerboard
  title="StreetSmartPHL"
  :web-map-id="webMapId"
  :show-default-sidebar="false"
>
  <template #sidebar="{ layers, visibleLayers, toggleLayer, setOpacity }">
    <TopicAccordion title="Paving" :expanded="true">
      <LayerCheckboxSet
        :layers="pavingLayers"
        :visible-layer-ids="visibleLayers"
        @toggle-layer="toggleLayer"
        @set-opacity="setOpacity"
      />
    </TopicAccordion>
  </template>
</Layerboard>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | *required* | App title in header |
| `webMapId` | `string` | *required* | ArcGIS Online WebMap ID |
| `subtitle` | `string` | — | Subtitle in header |
| `themeColor` | `string` | `"#0f4d90"` | Header/footer background color |
| `showDefaultSidebar` | `boolean` | `true` | Show built-in LayerPanel (false for custom sidebar) |
| `sidebarWidth` | `string` | `"30%"` | Sidebar width (CSS units) |
| `sidebarLabel` | `string` | `"Layers"` | Mobile toggle label for sidebar view |
| `mapLabel` | `string` | `"Map"` | Mobile toggle label for map view |
| `fetchMetadata` | `boolean` | `false` | Fetch layer metadata from Carto |
| `tiledLayers` | `TiledLayerConfig[]` | `[]` | ESRI MapServer tiled layers |
| `dataSources` | `DataSourceConfig[]` | `[]` | External API data sources |
| `layerStyleOverrides` | `Record<string, LayerStyleOverride>` | `{}` | Override paint/legend per layer |
| `popupOverrides` | `Record<string, PopupOverride>` | `{}` | Override popup behavior per layer |
| `initialZoom` | `number` | — | Initial map zoom level |
| `initialCenter` | `[number, number]` | — | Initial map center `[lng, lat]` |
| `cyclomediaConfig` | `CyclomediaConfig` | — | Cyclomedia street-level imagery config |
| `pictometryCredentials` | `PictometryCredentials` | — | Pictometry oblique imagery credentials |

### Control Positions

All default to sensible positions. Each accepts `"top-left" | "top-right" | "bottom-left" | "bottom-right"`.

| Prop | Default |
|------|---------|
| `basemapControlPosition` | `"top-right"` |
| `navigationControlPosition` | `"bottom-right"` |
| `geolocationControlPosition` | `"bottom-right"` |
| `searchControlPosition` | `"top-left"` |
| `drawControlPosition` | `"bottom-left"` (or `null` to remove) |
| `cyclomediaButtonPosition` | `"top-right"` |
| `pictometryButtonPosition` | `"top-right"` |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `configs-loaded` | `LayerConfig[]` | Layer configs loaded from WebMap |
| `load-error` | `string` | Error message on load failure |
| `zoom` | `number` | Zoom level changed |

## Slots

| Slot | Scope | Description |
|------|-------|-------------|
| `header` | — | Replace default header |
| `sidebar` | layer state + methods (see below) | Replace default LayerPanel |
| `footer` | `{ openModal, closeModal, isModalOpen }` | Custom footer content |
| `modal` | `{ closeModal }` | Modal content |

### Sidebar Slot Scope

The sidebar slot exposes the full layer state for building custom UIs:

```typescript
{
  layers: Array<{ config: LayerConfig; component: string }>
  visibleLayers: Set<string>
  layerOpacities: Record<string, number>
  loadingLayers: Set<string>
  layerErrors: Record<string, string>
  currentZoom: number
  toggleLayer: (id: string) => void
  setLayerVisible: (id: string, visible: boolean) => void
  setLayersVisible: (ids: string[], visible: boolean) => void
  setOpacity: (id: string, opacity: number) => void
  // Tiled layers
  tiledLayers: TiledLayerConfig[]
  visibleTiledLayers: Set<string>
  tiledLayerOpacities: Record<string, number>
  toggleTiledLayer: (id: string) => void
  setTiledLayerVisible: (id: string, visible: boolean) => void
  setTiledLayerOpacity: (id: string, opacity: number) => void
  // Data sources
  dataSourcesState: Record<string, DataSourceState>
  dataSourcesLoading: boolean
  getDataSource: (id: string) => unknown | null
  refetchDataSource: (id: string) => Promise<void>
}
```

## Components

All components are exported for building custom layouts:

```typescript
import {
  Layerboard,          // Main framework component
  LayerPanel,          // Flat layer list with search/legends/opacity
  MapPanel,            // MapLibre map with layer rendering
  TopicAccordion,      // Collapsible accordion for topic grouping
  LayerCheckboxSet,    // Checkbox controls for layer toggling
  LayerRadioButtonSet, // Radio buttons for mutually exclusive layers
} from "@phila/layerboard";
```

## Types

All types are exported:

```typescript
import type {
  LayerConfig,
  LayerDisplayOptions,
  LayerStyleOverride,
  LegendItem,
  PopupConfig,
  PopupField,
  PopupOverride,
  TiledLayerConfig,
  DataSourceConfig,
  DataSourceState,
  LayerboardConfig,
  TopicConfig,
  FeatureFlags,
  CyclomediaConfig,      // re-exported from @phila/phila-ui-map-core
  PictometryCredentials,  // re-exported from @phila/phila-ui-map-core
} from "@phila/layerboard";
```

## How It Works

1. You provide an ArcGIS Online **WebMap ID**
2. Layerboard fetches the WebMap JSON at runtime
3. Esri renderers, symbols, scales, and popup configs are transformed into MapLibre-compatible layer configs
4. Layers render on a MapLibre GL map — feature data is fetched from ArcGIS FeatureServer endpoints with spatial filtering and pagination
5. Server-side geometry simplification (`maxAllowableOffset`) scales with zoom level for polygon layers

## Development

```sh
pnpm install
pnpm build        # type-check + vite build
```

### Publishing

```sh
pnpm version prerelease   # bump beta version
git push origin main
git tag v<version> && git push origin v<version>   # triggers publish workflow
```
