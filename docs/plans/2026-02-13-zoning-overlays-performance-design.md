# Zoning Overlays Performance Fix (bead 5ia)

## Problem

The Zoning Overlays layer (194 features) produces 10MB+ of GeoJSON due to extremely complex polygon geometries (thousands of vertices per feature). This freezes the browser when the layer is toggled on.

## Solution

Use ArcGIS server-side geometry simplification via the `maxAllowableOffset` query parameter. The offset scales with zoom level so detail increases as you zoom in.

## Implementation

In `MapPanel.vue`:

1. Add a `SIMPLIFY_GEOMETRY_LAYER_IDS` constant listing layers that need simplification (starting with `zoning-overlays`)
2. Add an optional `zoom` parameter to `fetchFeaturesInBounds()`
3. For layers in the simplification list, calculate `maxAllowableOffset` from zoom and append to the query URL
4. Offset formula: `360 / (2^zoom * 512)` -- ties tolerance to pixel resolution at each zoom level

At zoom 14 (roughly where Zoning Overlays becomes visible), this gives ~0.00004 degrees (~4.5m tolerance), reducing data volume ~70% while preserving visually accurate boundaries. At zoom 18+, no simplification is applied.

## Files

- `src/components/MapPanel.vue` -- add simplification list, pass zoom to fetch, modify query URL

## Alternatives Considered

- **Client-side simplification (Turf.js)**: Still downloads 10MB+ before simplifying; doesn't solve the core problem
- **Fix viewport clipping**: Was tried; layer stopped rendering entirely due to MultiPolygon/hole geometry issues; also doesn't reduce download size
