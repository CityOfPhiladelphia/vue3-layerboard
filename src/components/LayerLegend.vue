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
