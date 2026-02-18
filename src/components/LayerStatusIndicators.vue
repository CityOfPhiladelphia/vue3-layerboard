<script setup lang="ts">
defineProps<{
  loading: boolean;
  error: string | null;
  unavailable: boolean;
}>();
</script>

<template>
  <span v-if="loading && !unavailable" class="loading-indicator" role="status"> Loading... </span>
  <span v-if="error" class="error-indicator" :aria-label="error" role="status"> Error </span>
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
