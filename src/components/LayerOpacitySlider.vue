<script setup lang="ts">
defineProps<{
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
    <label class="opacity-label" :for="'opacity-' + layerId"> Opacity: {{ Math.round(opacity * 100) }}% </label>
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
