# Layer Component Deduplication (C1) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract duplicated helper functions, template blocks, and CSS from LayerCheckboxSet, LayerRadioButtonSet, and LayerPanel into shared composable and sub-components.

**Architecture:** Create a `useLayerState` composable for shared helper functions, then extract three sub-components (LayerStatusIndicators, LayerOpacitySlider, LayerLegend) that encapsulate repeated template+CSS blocks. Each parent keeps its selection mechanism and unique features.

**Tech Stack:** Vue 3 (script setup + TypeScript), existing types from `src/types/layer.ts`

**Verification:** This project has no unit test runner. Verify with `pnpm vue-tsc --noEmit` (type-check) and `pnpm build` after each task. Visual QA is done by Andy via dev server.

---

### Task 1: Create `useLayerState` composable

**Files:**
- Create: `src/composables/useLayerState.ts`

**Step 1: Create the composable**

```ts
import type { LayerConfig } from "@/types/layer";

interface LayerStateProps {
  visibleLayerIds: Set<string>;
  layerOpacities: Record<string, number>;
  loadingLayerIds: Set<string>;
  layerErrors: Record<string, string>;
  currentZoom: number;
}

export function useLayerState(getProps: () => LayerStateProps) {
  function isVisible(layerId: string): boolean {
    return getProps().visibleLayerIds.has(layerId);
  }

  function getLayerOpacity(layerId: string): number {
    return getProps().layerOpacities[layerId] ?? 1;
  }

  function isLayerLoading(layerId: string): boolean {
    return getProps().loadingLayerIds.has(layerId);
  }

  function getLayerError(layerId: string): string | null {
    return getProps().layerErrors[layerId] || null;
  }

  function isLayerAvailableAtZoom(config: LayerConfig): boolean {
    const zoom = getProps().currentZoom;
    const minZoom = config.minZoom;
    const maxZoom = config.maxZoom;
    if (minZoom !== undefined && zoom < minZoom) return false;
    if (maxZoom !== undefined && zoom > maxZoom) return false;
    return true;
  }

  return { isVisible, getLayerOpacity, isLayerLoading, getLayerError, isLayerAvailableAtZoom };
}
```

Note: Uses a getter function `getProps()` instead of a reactive ref so it works with Vue's `defineProps` (which is already reactive). Each parent calls `useLayerState(() => props)`.

**Step 2: Type-check**

Run: `pnpm vue-tsc --noEmit`
Expected: PASS (new file, no consumers yet)

**Step 3: Commit**

```bash
git add src/composables/useLayerState.ts
git commit -m "add useLayerState composable for shared layer helpers"
```

---

### Task 2: Wire `useLayerState` into LayerCheckboxSet

**Files:**
- Modify: `src/components/LayerCheckboxSet.vue` (lines 53-76 — remove 5 helper functions, add composable import + call)

**Step 1: Replace helper functions with composable**

Remove these functions (lines 53-76):
- `isVisible`
- `getLayerOpacity`
- `isLayerLoading`
- `getLayerError`
- `isLayerAvailableAtZoom`

Add import and composable call after props definition:

```ts
import { useLayerState } from "@/composables/useLayerState";

// ... after props ...

const { isVisible, getLayerOpacity, isLayerLoading, getLayerError, isLayerAvailableAtZoom } = useLayerState(() => props);
```

Template and CSS remain unchanged — the function names are identical.

**Step 2: Type-check**

Run: `pnpm vue-tsc --noEmit`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/LayerCheckboxSet.vue
git commit -m "use useLayerState composable in LayerCheckboxSet"
```

---

### Task 3: Wire `useLayerState` into LayerRadioButtonSet

**Files:**
- Modify: `src/components/LayerRadioButtonSet.vue` (lines 54-78 — remove 5 helper functions, add composable import + call)

**Step 1: Replace helper functions with composable**

Same pattern as Task 2. Remove the 5 identical functions, add import + destructured call.

**Step 2: Type-check**

Run: `pnpm vue-tsc --noEmit`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/LayerRadioButtonSet.vue
git commit -m "use useLayerState composable in LayerRadioButtonSet"
```

---

### Task 4: Wire `useLayerState` into LayerPanel

**Files:**
- Modify: `src/components/LayerPanel.vue` (lines 80-103 — remove 5 helper functions, add composable import + call)

**Important:** LayerPanel uses different prop names: `visibleLayers` (not `visibleLayerIds`), `loadingLayers` (not `loadingLayerIds`). The composable getter must map these:

```ts
const { isVisible, getLayerOpacity, isLayerLoading, getLayerError, isLayerAvailableAtZoom } = useLayerState(() => ({
  visibleLayerIds: props.visibleLayers,
  layerOpacities: props.layerOpacities,
  loadingLayerIds: props.loadingLayers,
  layerErrors: props.layerErrors,
  currentZoom: props.currentZoom,
}));
```

**Step 1: Replace helper functions with composable**

Remove the 5 functions, add import + mapped call as shown above.

**Step 2: Type-check**

Run: `pnpm vue-tsc --noEmit`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/LayerPanel.vue
git commit -m "use useLayerState composable in LayerPanel"
```

---

### Task 5: Create `LayerStatusIndicators.vue`

**Files:**
- Create: `src/components/LayerStatusIndicators.vue`

**Step 1: Create the component**

```vue
<script setup lang="ts">
defineProps<{
  loading: boolean;
  error: string | null;
  unavailable: boolean;
}>();
</script>

<template>
  <span v-if="loading && !unavailable" class="loading-indicator" role="status"> Loading... </span>
  <span
    v-if="error"
    class="error-indicator"
    :aria-label="error"
    role="status"
  >
    Error
  </span>
  <span v-if="unavailable" class="zoom-indicator"> (zoom in) </span>
</template>

<style scoped>
.zoom-indicator {
  font-size: 13px;
  color: #767676;
  font-style: italic;
  margin-left: 4px;
}

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

.error-indicator {
  font-size: 11px;
  color: #c00;
  font-weight: bold;
  margin-left: 4px;
}
</style>
```

**Step 2: Type-check**

Run: `pnpm vue-tsc --noEmit`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/LayerStatusIndicators.vue
git commit -m "add LayerStatusIndicators component"
```

---

### Task 6: Use `LayerStatusIndicators` in all three parents

**Files:**
- Modify: `src/components/LayerCheckboxSet.vue`
- Modify: `src/components/LayerRadioButtonSet.vue`
- Modify: `src/components/LayerPanel.vue`

**Step 1: Replace inline indicators in LayerCheckboxSet**

Import `LayerStatusIndicators` and replace the three `<span>` elements (loading, error, zoom) inside both the checkbox label and the label-only div with:

```vue
<LayerStatusIndicators
  :loading="isLayerLoading(layer.id)"
  :error="getLayerError(layer.id)"
  :unavailable="!isLayerAvailableAtZoom(layer)"
/>
```

This appears twice in LayerCheckboxSet (once in the `v-if="shouldShowCheckbox"` label, once in the `v-else` label-only div).

Remove the duplicated CSS for `.zoom-indicator`, `.loading-indicator`, `.loading-indicator::before`, `@keyframes spin`, `.error-indicator` from the `<style>` block.

**Step 2: Replace inline indicators in LayerRadioButtonSet**

Same pattern — one instance inside the radio label. Remove the same CSS rules.

**Step 3: Replace inline indicators in LayerPanel**

Same pattern — one instance inside the checkbox label. In LayerPanel the data access is `layer.config.id` and `layer.config` (not just `layer.id` / `layer`):

```vue
<LayerStatusIndicators
  :loading="isLayerLoading(layer.config.id)"
  :error="getLayerError(layer.config.id)"
  :unavailable="!isLayerAvailableAtZoom(layer.config)"
/>
```

Remove the same CSS rules from LayerPanel's style block.

**Step 4: Type-check**

Run: `pnpm vue-tsc --noEmit`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/LayerCheckboxSet.vue src/components/LayerRadioButtonSet.vue src/components/LayerPanel.vue
git commit -m "use LayerStatusIndicators in all layer components"
```

---

### Task 7: Create `LayerOpacitySlider.vue`

**Files:**
- Create: `src/components/LayerOpacitySlider.vue`

**Step 1: Create the component**

```vue
<script setup lang="ts">
const props = defineProps<{
  layerId: string;
  layerName: string;
  opacity: number;
}>();

const emit = defineEmits<{
  (e: "update:opacity", opacity: number): void;
}>();

function onInput(event: Event) {
  const input = event.target as HTMLInputElement;
  emit("update:opacity", parseFloat(input.value));
}
</script>

<template>
  <div class="opacity-control">
    <label class="opacity-label" :for="'opacity-' + layerId">
      Opacity: {{ Math.round(opacity * 100) }}%
    </label>
    <input
      :id="'opacity-' + layerId"
      type="range"
      min="0"
      max="1"
      step="0.05"
      :value="opacity"
      :aria-label="'Opacity for ' + layerName"
      class="opacity-slider"
      @input="onInput"
    />
  </div>
</template>

<style scoped>
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
</style>
```

**Note on padding:** The default `padding: 4px 8px 8px 36px` matches LayerCheckboxSet and LayerRadioButtonSet. LayerPanel uses `padding: 4px 8px 12px 40px` (and `64px` with metadata). LayerPanel will override this with a scoped CSS rule on the component (`:deep(.opacity-control)`).

**Step 2: Type-check**

Run: `pnpm vue-tsc --noEmit`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/LayerOpacitySlider.vue
git commit -m "add LayerOpacitySlider component"
```

---

### Task 8: Use `LayerOpacitySlider` in all three parents

**Files:**
- Modify: `src/components/LayerCheckboxSet.vue`
- Modify: `src/components/LayerRadioButtonSet.vue`
- Modify: `src/components/LayerPanel.vue`

**Step 1: Replace opacity block in LayerCheckboxSet**

Replace the `<div class="opacity-control">...</div>` block with:

```vue
<LayerOpacitySlider
  v-if="shouldShowSlider(layer, showOpacity) && isVisible(layer.id) && isLayerAvailableAtZoom(layer)"
  :layer-id="layer.id"
  :layer-name="getLayerDisplayName(layer)"
  :opacity="getLayerOpacity(layer.id)"
  @update:opacity="emit('setOpacity', layer.id, $event)"
/>
```

Remove `.opacity-control`, `.opacity-label`, `.opacity-slider`, `.opacity-slider:focus-visible` from CSS.

Also remove the `onOpacityChange` function from script (no longer needed — the sub-component handles the event parsing).

**Step 2: Replace opacity block in LayerRadioButtonSet**

Same pattern. Also remove `onOpacityChange`.

**Step 3: Replace opacity block in LayerPanel**

```vue
<LayerOpacitySlider
  v-if="showOpacity && isVisible(layer.config.id) && isLayerAvailableAtZoom(layer.config)"
  :layer-id="layer.config.id"
  :layer-name="layer.config.title"
  :opacity="getLayerOpacity(layer.config.id)"
  @update:opacity="emit('setOpacity', layer.config.id, $event)"
/>
```

Remove `.opacity-control`, `.has-metadata .opacity-control`, `.opacity-label`, `.opacity-slider`, `.opacity-slider:focus-visible` from CSS.

Also remove `onOpacityChange`.

Add scoped override for LayerPanel's different padding:

```css
:deep(.opacity-control) {
  padding: 4px 8px 12px 40px;
}

.has-metadata :deep(.opacity-control) {
  padding-left: 64px;
}
```

**Step 4: Type-check**

Run: `pnpm vue-tsc --noEmit`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/LayerCheckboxSet.vue src/components/LayerRadioButtonSet.vue src/components/LayerPanel.vue
git commit -m "use LayerOpacitySlider in all layer components"
```

---

### Task 9: Create `LayerLegend.vue`

**Files:**
- Create: `src/components/LayerLegend.vue`

**Step 1: Create the component**

```vue
<script setup lang="ts">
import type { LegendItem } from "@/types/layer";

defineProps<{
  items: LegendItem[];
  label: string;
}>();
</script>

<template>
  <ul class="layer-legend" :aria-label="label">
    <li v-for="(item, index) in items" :key="index" class="legend-item">
      <span
        v-if="item.type === 'circle'"
        class="legend-symbol legend-circle"
        :style="{ backgroundColor: item.color }"
        aria-hidden="true"
      ></span>

      <span
        v-else-if="item.type === 'line'"
        class="legend-symbol legend-line"
        :style="{
          backgroundColor: item.color,
          height: `${item.width || 2}px`,
        }"
        aria-hidden="true"
      ></span>

      <span
        v-else-if="item.type === 'fill'"
        class="legend-symbol legend-fill"
        :style="{ backgroundColor: item.color }"
        aria-hidden="true"
      ></span>

      <span class="legend-label">{{ item.label }}</span>
    </li>
  </ul>
</template>

<style scoped>
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
</style>
```

**Note on padding/margin:** Default `padding: 4px 8px 8px 36px` and `margin: 0` match checkbox/radio sets. LayerPanel uses `padding: 4px 8px 8px 40px` and `margin: 0 0 8px 0`. LayerPanel will override with `:deep()`.

**Step 2: Type-check**

Run: `pnpm vue-tsc --noEmit`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/LayerLegend.vue
git commit -m "add LayerLegend component"
```

---

### Task 10: Use `LayerLegend` in all three parents

**Files:**
- Modify: `src/components/LayerCheckboxSet.vue`
- Modify: `src/components/LayerRadioButtonSet.vue`
- Modify: `src/components/LayerPanel.vue`

**Step 1: Replace legend block in LayerCheckboxSet**

Replace the `<ul class="layer-legend">...</ul>` block with:

```vue
<LayerLegend
  v-if="shouldShowLegendBox(layer, showLegend) && isVisible(layer.id) && isLayerAvailableAtZoom(layer) && layer.legend?.length"
  :items="layer.legend"
  :label="'Legend for ' + getLayerDisplayName(layer)"
/>
```

Remove all legend CSS: `.layer-legend`, `.legend-item`, `.legend-symbol`, `.legend-circle`, `.legend-line`, `.legend-fill`, `.legend-label`.

**Step 2: Replace legend block in LayerRadioButtonSet**

Same pattern. Remove same CSS rules.

**Step 3: Replace legend block in LayerPanel**

```vue
<LayerLegend
  v-if="showLegend && isVisible(layer.config.id) && isLayerAvailableAtZoom(layer.config) && layer.config.legend?.length"
  :items="layer.config.legend"
  :label="'Legend for ' + layer.config.title"
/>
```

Remove legend CSS. Add scoped override:

```css
:deep(.layer-legend) {
  padding: 4px 8px 8px 40px;
  margin: 0 0 8px 0;
}

.has-metadata :deep(.layer-legend) {
  padding-left: 64px;
}
```

**Step 4: Type-check**

Run: `pnpm vue-tsc --noEmit`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/LayerCheckboxSet.vue src/components/LayerRadioButtonSet.vue src/components/LayerPanel.vue
git commit -m "use LayerLegend in all layer components"
```

---

### Task 11: Final verification and build

**Step 1: Type-check**

Run: `pnpm vue-tsc --noEmit`
Expected: PASS

**Step 2: Build**

Run: `pnpm build`
Expected: PASS (pre-existing dts warnings about `import.meta.env` in layerConfigService.ts are OK)

**Step 3: Commit build if any generated files changed**

Unlikely, but if `dist/` is tracked, commit.
