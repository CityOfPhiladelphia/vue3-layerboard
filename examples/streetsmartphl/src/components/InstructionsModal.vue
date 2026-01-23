<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCheckSquare,
  faMapMarkerAlt,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { faCircle, faSquare } from '@fortawesome/free-regular-svg-icons'
</script>

<template>
  <div class="instructions-modal-content">
    <h2 class="instructions-title">How to use StreetSmartPHL</h2>

    <div class="instructions-grid">
      <div class="instructions-icon">
        <div class="topic-pills">
          <div class="topic-pill">PermitPHL</div>
          <div class="topic-pill">PavePHL</div>
        </div>
      </div>
      <div class="instructions-text">
        <p><b>Open topics on the left to expose controls for turning on and off map layers.</b></p>
        <p>You can only open one topic at a time.</p>
      </div>

      <div class="instructions-icon">
        <FontAwesomeIcon :icon="faCheckSquare" class="fa-3x" />
      </div>
      <div class="instructions-text">
        <p><b>If a topic offers checkboxes, toggle map layers on and off with them.</b></p>
        <p>You can toggle on as many layers with checkboxes as you want, and they will all show on the map.</p>
      </div>

      <div class="instructions-icon">
        <FontAwesomeIcon :icon="faCircle" class="fa-3x" />
      </div>
      <div class="instructions-text">
        <p><b>If a topic offers radio buttons, select one to view a single map layer.</b></p>
        <p>You can only view one layer at a time if a topic uses radio buttons.</p>
      </div>

      <div class="instructions-icon">
        <FontAwesomeIcon :icon="faSquare" class="fa-3x" />
      </div>
      <div class="instructions-text">
        <p><b>If a checkbox is grayed out, zoom in further on the map and it will become active.</b></p>
        <p>Many of the layers will not show when the map is zoomed out too far.</p>
      </div>

      <div class="instructions-icon">
        <FontAwesomeIcon :icon="faMapMarkerAlt" class="fa-3x" />
      </div>
      <div class="instructions-text">
        <p><b>Click on any feature that appears on the map to get a popup with that feature's info.</b></p>
        <p>If you have turned on overlapping layers, you will be able to click through multiple popups of info.</p>
      </div>

      <div class="instructions-icon">
        <FontAwesomeIcon :icon="faSearch" class="fa-3x" />
      </div>
      <div class="instructions-text">
        <p><b>Search for an address or intersection.</b></p>
        <p>The map will move to the location that you have searched.</p>
      </div>

      <div class="instructions-icon">
        <img
          class="street-view-image"
          src="../assets/cyclomedia_blue.png"
          alt="Street view"
        >
      </div>
      <div class="instructions-text">
        <p><b>Toggle on and off street view.</b></p>
        <p>Half of the map panel will be taken up by the street view. If you are zoomed in far enough, circles will appear along the streets in the map. Click on a circle to change the street view location to that point.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.instructions-modal-content {
  color: #0f4d90;
  max-width: 600px;
}

.instructions-title {
  text-align: center;
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: bold;
}

.instructions-grid {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 15px 20px;
  align-items: start;
}

.instructions-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f4d90;
}

.instructions-text {
  padding: 0;
}

.instructions-text p {
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.instructions-text p:last-child {
  margin-bottom: 0;
}

.topic-pills {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.topic-pill {
  border: 2px solid #0f4d90;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
}

.street-view-image {
  width: 50px;
  height: 60px;
}

/* Mobile adjustments */
@media (max-width: 500px) {
  .instructions-grid {
    grid-template-columns: 60px 1fr;
    gap: 12px 15px;
  }

  .instructions-title {
    font-size: 20px;
  }

  .topic-pill {
    font-size: 10px;
    padding: 2px 6px;
  }
}
</style>
