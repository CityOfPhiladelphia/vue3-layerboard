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

      <span v-if="items.length > 1" class="legend-label">{{ item.label }}</span>
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
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-line {
  width: 22px;
  min-height: 4px;
  border-radius: 1px;
}

.legend-fill {
  width: 16px;
  height: 16px;
  border: 1px solid #666;
}

.legend-label {
  font-size: 14px;
  color: #555;
}
</style>
