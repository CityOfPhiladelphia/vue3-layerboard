# UniqueValue Split-Layer Support for Mixed Dash Styles

_2026-03-03_
_Bead: StreetSmartPHL-6i9_

## Problem

The `convertUniqueValueRenderer` in `webmap-transformer.ts` silently drops dash patterns when a uniqueValue renderer has mixed line styles across its values. MapLibre's `line-dasharray` doesn't support data-driven expressions, so a single layer can only have one dash pattern.

The classBreaks renderer already handles this via `buildSplitLayers()`, which splits the layer into multiple MapLibre layers (one per dash style). The uniqueValue renderer needs the same treatment.

## Concrete Case

The PickupPHL sanitation-visits layers use a uniqueValue renderer on a status field with three values:

| Value | Color | ArcGIS Style | MapLibre Dash |
|-------|-------|-------------|---------------|
| RUBBISH | `[73,167,73]` green | `esriSLSDashDotDot` | `[4,1,1,1,1,1]` |
| RECYCLE | `[15,77,144]` blue | `esriSLSDash` | `[4,3]` |
| BOTH | `[204,133,0]` orange | `esriSLSSolid` | none |

Currently all render as solid lines because the mixed-style check at line 650 finds 3 styles and does nothing.

## Design

### New function: `buildUniqueValueSplitLayers`

Located in `webmap-transformer.ts`, alongside the existing `buildSplitLayers`.

**Input:** uniqueValueInfos, field name, defaultSymbol, layerOpacity

**Process:**
1. Group uniqueValueInfos by dash style (e.g., all `esriSLSDash` values together)
2. For each group, build a `SplitLayer` with:
   - **WHERE clause**: `field = 'VALUE1' OR field = 'VALUE2'` (string values single-quoted for ArcGIS SQL)
   - **Paint**: color (single or match expression), width, opacity, dash pattern
   - **Legend**: entries for each value in the group
   - **Suffix**: first group keeps original ID, subsequent get style-based suffix (same convention as classBreaks)

**Output:** `SplitLayer[]` — same interface the consumer at line 1465 already handles.

### Change to `convertUniqueValueRenderer`

In the line geometry branch (line 617), replace the current "all-same-style" check with:

```
if uniqueStyles.length === 1:
  apply dash pattern to single layer (existing behavior)
else if uniqueStyles.length > 1:
  return { splitLayers: buildUniqueValueSplitLayers(...), ... }
```

### WHERE clause format

ArcGIS REST API query endpoint handles string equality: `status = 'RUBBISH'`. Values are single-quoted per SQL convention. Multiple values in same group: `status = 'VAL1' OR status = 'VAL2'`.

### No downstream changes needed

The split-layer consumer at line 1465 is generic — it iterates `splitLayers` and calls `buildLayerConfig` for each. Works for both classBreaks and uniqueValue split layers.

## Verification

1. Verify string WHERE clauses work against the ArcGIS endpoint
2. Build layerboard, test via linked streetsmartphl
3. Confirm three line styles render correctly at zoom >= 14
4. Confirm legend colors in PickupVisitLegend.vue match actual rendered colors (update if needed)
