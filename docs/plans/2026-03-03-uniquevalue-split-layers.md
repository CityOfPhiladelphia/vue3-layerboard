# UniqueValue Split-Layer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Support mixed dash styles in uniqueValue renderers by splitting into multiple MapLibre layers.

**Architecture:** Add a `buildUniqueValueSplitLayers` function that groups uniqueValueInfos by dash style and returns `SplitLayer[]`. Modify `convertUniqueValueRenderer` to call it when mixed styles are detected. No downstream changes — the existing split-layer consumer handles it.

**Tech Stack:** TypeScript, MapLibre GL JS, ArcGIS REST API

---

### Task 1: Verify ArcGIS string WHERE clauses

**Files:**
- None (manual verification)

**Step 1: Test the ArcGIS query endpoint with a string equality WHERE clause**

Run:
```bash
curl -s "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/StreetSmartPHL/FeatureServer/8/query?where=VISITTYPE%3D%27RUBBISH%27&returnCountOnly=true&f=json"
```

If the field name isn't `VISITTYPE`, try fetching the layer metadata first:
```bash
curl -s "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/StreetSmartPHL/FeatureServer/8?f=json" | python3 -c "import sys,json; d=json.load(sys.stdin); [print(f['name'],f['type']) for f in d.get('fields',[])]"
```

Use the actual field name from the uniqueValue renderer (look at the WebMap JSON — the renderer's `field1` value). Test with single-quoted string values in the WHERE clause.

Expected: A JSON response with `count > 0`, confirming ArcGIS accepts string equality filters.

**Step 2: Note the actual field name for reference**

The WebMap renderer uses `field1` which `convertUniqueValueRenderer` reads at line 551:
```typescript
const field = renderer.field1!.toLowerCase();
```
The WHERE clause must use this exact (lowercased) field name.

---

### Task 2: Add `buildUniqueValueSplitLayers` function

**Files:**
- Modify: `src/utils/webmap-transformer.ts:253` (after existing `buildSplitLayers`)

**Step 1: Write the function**

Insert after line 253 (after `buildSplitLayers`'s closing brace), before the color conversion section:

```typescript
/**
 * Build split layers from unique values with mixed dash styles.
 *
 * Groups unique values by dash style, then builds a SplitLayer for each group
 * with its own WHERE clause, paint properties, and legend entries.
 */
function buildUniqueValueSplitLayers(
  uniqueValueInfos: NonNullable<EsriRenderer["uniqueValueInfos"]>,
  field: string,
  defaultSymbol: EsriSymbol | undefined,
  layerOpacity?: number,
  customLabelMap?: Map<string, string>,
): SplitLayer[] {
  // Group unique values by dash style
  const styleGroups = new Map<string, typeof uniqueValueInfos>();
  for (const info of uniqueValueInfos) {
    const style = info.symbol?.style || "esriSLSSolid";
    if (!styleGroups.has(style)) {
      styleGroups.set(style, []);
    }
    styleGroups.get(style)!.push(info);
  }

  const splitLayers: SplitLayer[] = [];
  const seenStyles = new Set<string>();
  let isFirst = true;

  for (const [style, infos] of styleGroups) {
    const dashArray = esriLineDashArray(style);

    // WHERE clause: field = 'VALUE1' OR field = 'VALUE2'
    const conditions = infos.map(info => `${field} = '${String(info.value).replace(/'/g, "''")}'`);
    const whereClause = conditions.join(" OR ");

    // Paint properties
    const groupPaint: Record<string, unknown> = {
      "line-opacity": convertOpacity(layerOpacity),
    };
    if (dashArray) {
      groupPaint["line-dasharray"] = dashArray;
    }

    if (infos.length === 1) {
      groupPaint["line-color"] = esriColorToCSS(infos[0]!.symbol?.color);
      groupPaint["line-width"] = ptToPx(infos[0]!.symbol?.width || 2);
    } else {
      // Multiple values share the same dash style — use match expression
      const colorMatch: unknown[] = ["match", ["to-string", ["get", field]]];
      for (const info of infos) {
        colorMatch.push(coerceMatchValue(info.value));
        colorMatch.push(esriColorToCSS(info.symbol?.color));
      }
      colorMatch.push(defaultSymbol ? esriColorToCSS(defaultSymbol.color) : "rgba(0, 0, 0, 0)");
      groupPaint["line-color"] = colorMatch;
      groupPaint["line-width"] = ptToPx(infos[0]!.symbol?.width || 2);
    }

    // Legend entries
    const groupLegend: LegendItem[] = [];
    for (const info of infos) {
      const valueStr = String(info.value);
      const customLabel = customLabelMap?.get(valueStr);
      const label = customLabel || info.label || valueStr;
      groupLegend.push({
        type: "line" as const,
        color: esriColorToCSS(info.symbol?.color),
        width: ptToPx(info.symbol?.width || 1),
        label,
      });
    }

    // Suffix: first group keeps original ID, subsequent get style-based suffix
    const styleName = style.replace("esriSLS", "").toLowerCase();
    let suffix: string;
    if (isFirst) {
      suffix = "";
    } else if (seenStyles.has(styleName)) {
      suffix = `-${styleName}-${splitLayers.length}`;
    } else {
      suffix = `-${styleName}`;
    }
    seenStyles.add(styleName);
    isFirst = false;

    splitLayers.push({ suffix, where: whereClause, paint: groupPaint, legend: groupLegend });
  }

  return splitLayers;
}
```

**Step 2: Commit**

```bash
git add src/utils/webmap-transformer.ts
git commit -m "add buildUniqueValueSplitLayers for mixed dash styles"
```

---

### Task 3: Wire up split-layer path in `convertUniqueValueRenderer`

**Files:**
- Modify: `src/utils/webmap-transformer.ts:647-655` (the mixed-style handling in line geometry branch)

**Step 1: Replace the single-style-only check with split-layer support**

Replace lines 647-655 (the current dash pattern block in the `geomType === "line"` branch of `convertUniqueValueRenderer`):

```typescript
    // Apply dash pattern if all symbols use the same non-solid style
    const styles = uniqueValueInfos.map(i => i.symbol?.style).filter(Boolean);
    const uniqueStyles = [...new Set(styles)];
    if (uniqueStyles.length === 1) {
      const dashArray = esriLineDashArray(uniqueStyles[0]);
      if (dashArray) {
        paint["line-dasharray"] = dashArray;
      }
    }
```

With:

```typescript
    // Check dash styles across unique values
    const styles = uniqueValueInfos.map(i => i.symbol?.style || "esriSLSSolid");
    const uniqueStyles = [...new Set(styles)];

    if (uniqueStyles.length > 1) {
      // Mixed dash styles — must split into separate MapLibre layers
      const splitLayers = buildUniqueValueSplitLayers(uniqueValueInfos, field, defaultSymbol, layerOpacity, customLabelMap);
      return { paint: {}, legend: [], geomType, outlinePaint, splitLayers };
    }

    // All values share the same dash style — apply to single layer
    if (uniqueStyles.length === 1) {
      const dashArray = esriLineDashArray(uniqueStyles[0]);
      if (dashArray) {
        paint["line-dasharray"] = dashArray;
      }
    }
```

Note: The mixed-dash path returns early (same pattern as classBreaks at line 777-778). The `paint: {}` and `legend: []` are ignored when `splitLayers` is present — the consumer at line 1465 only uses split-layer data.

**Step 2: Commit**

```bash
git add src/utils/webmap-transformer.ts
git commit -m "wire uniqueValue split-layers for mixed dash styles"
```

---

### Task 4: Build and verify in streetsmartphl

**Files:**
- None modified (build + visual verification)

**Step 1: Build vue3-layerboard**

Run from `c:/Users/andy.rothwell/Projects/vue3-layerboard`:
```bash
pnpm build
```

Expected: Build succeeds (TS warnings about `import.meta.env` are pre-existing and harmless).

**Step 2: Visual verification in streetsmartphl**

Andy runs his dev server for streetsmartphl. Verify:
1. Open PickupPHL topic
2. Zoom in past the feature layer threshold
3. Confirm three different line styles appear:
   - Green dash-dot-dot lines (RUBBISH / trash visited)
   - Blue dashed lines (RECYCLE / recycling visited)
   - Orange solid lines (BOTH / both visited)
4. Confirm the legend in the sidebar matches the actual rendered colors

**Step 3: Update legend colors if needed**

If the rendered colors don't match the hardcoded legend colors in `c:/Users/andy.rothwell/Projects/streetsmartphl/src/components/PickupVisitLegend.vue`, update the hex values to match. The WebMap says:
- RUBBISH: `[73,167,73]` = `#49a749`
- RECYCLE: `[15,77,144]` = `#0f4d90`
- BOTH: `[204,133,0]` = `#cc8500`

Also update the dash pattern descriptions in the legend if needed:
- RUBBISH uses `esriSLSDashDotDot` (not solid)
- RECYCLE uses `esriSLSDash`
- BOTH uses `esriSLSSolid` (not dashed)

This is the opposite of what the original legend assumed! The legend component needs to swap its line styles accordingly.

**Step 4: Commit any legend fixes**

```bash
cd c:/Users/andy.rothwell/Projects/streetsmartphl
git add src/components/PickupVisitLegend.vue
git commit -m "fix legend colors and line styles to match WebMap renderer"
```

---

### Task 5: Close bead and final commit

**Step 1: Close bead in streetsmartphl**

```bash
cd c:/Users/andy.rothwell/Projects/streetsmartphl
bd close StreetSmartPHL-6i9
```

**Step 2: Commit bead closure**

```bash
git add .beads/issues.jsonl
git commit -m "close bead 6i9 — PickupPHL truck visit line patterns fixed"
```
