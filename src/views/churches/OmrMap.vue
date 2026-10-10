<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ATTENDANCE_BANDS, attendanceColor, parseOmrMapChurches, type OmrMapChurch } from "@/helpers/omrMap";
import { churchService } from "@/services/churchService";
import { countryService } from "@/services/countryService";
import {
  loadGoogleMaps,
  type GoogleMapInstance,
  type GoogleMarkerInstance,
} from "@/services/googleMapsLoader";
import { useAuthStore } from "@/stores/authStore";

const { t } = useI18n();
const authStore = useAuthStore();

const WORLD_CENTER = { lat: 20, lng: 10 };
const mapEl = ref<HTMLElement | null>(null);
const mapError = ref("");
const loading = ref(false);
const selectedId = ref<number | null>(null);
const hoverChurch = ref<OmrMapChurch | null>(null);
const hoverPoint = ref({ x: 0, y: 0 });
const churches = reactive(new Map<number, OmrMapChurch>());

const selected = computed(() =>
  selectedId.value == null ? null : churches.get(selectedId.value) ?? null,
);

type MarkerEntry = {
  church: OmrMapChurch;
  marker: GoogleMarkerInstance;
};

let map: GoogleMapInstance | null = null;
let disposed = false;
let fetchTimer = 0;
let hoverTimer = 0;
let lastBoundsKey = "";
const markerEntries = new Map<number, MarkerEntry>();

function displayValue(value: string) {
  return value.trim() ? value : "—";
}

function markerIcon(church: OmrMapChurch, active: boolean) {
  return {
    path: window.google?.maps.SymbolPath.CIRCLE,
    fillColor: attendanceColor(church.attendance),
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: active ? 2 : 1.5,
    scale: active ? 10 : 8,
  };
}

function paintMarker(entry: MarkerEntry) {
  const active = selectedId.value === entry.church.id;
  entry.marker.setIcon(markerIcon(entry.church, active));
  entry.marker.setZIndex(active ? 1000 : 1);
}

let projectionOverlay: {
  getProjection: () => {
    fromLatLngToContainerPixel: (position: { lat: () => number; lng: () => number }) => { x: number; y: number } | null;
  } | null;
  draw: () => void;
  setMap: (map: GoogleMapInstance | null) => void;
} | null = null;

function placeHover(entry: MarkerEntry) {
  const position = entry.marker.getPosition();
  const point = position
    ? projectionOverlay?.getProjection()?.fromLatLngToContainerPixel(position)
    : null;
  if (!point) {
    hoverChurch.value = null;
    return;
  }
  hoverPoint.value = { x: point.x, y: point.y };
  hoverChurch.value = entry.church;
}

function showHover(entry: MarkerEntry) {
  window.clearTimeout(hoverTimer);
  placeHover(entry);
}

function scheduleHideHover() {
  window.clearTimeout(hoverTimer);
  hoverTimer = window.setTimeout(() => {
    hoverChurch.value = null;
  }, 80);
}

function toggleChurch(church: OmrMapChurch) {
  hoverChurch.value = null;
  selectedId.value = selectedId.value === church.id ? null : church.id;
  markerEntries.forEach((entry) => paintMarker(entry));
}

function closePanel() {
  selectedId.value = null;
  markerEntries.forEach((entry) => paintMarker(entry));
}

function addChurch(church: OmrMapChurch) {
  if (!map || !window.google) return;

  const existing = markerEntries.get(church.id);
  if (existing) {
    if (existing.church.attendance === church.attendance) return;
    existing.church = church;
    churches.set(church.id, church);
    paintMarker(existing);
    return;
  }

  const marker = new window.google.maps.Marker({
    position: { lat: church.latitude, lng: church.longitude },
    map,
    icon: markerIcon(church, false),
  });
  const entry: MarkerEntry = { church, marker };
  marker.addListener("mouseover", () => showHover(entry));
  marker.addListener("mouseout", () => scheduleHideHover());
  marker.addListener("click", () => toggleChurch(entry.church));
  markerEntries.set(church.id, entry);
  churches.set(church.id, church);
  paintMarker(entry);
}

function boundsQuery() {
  const bounds = map?.getBounds();
  if (!bounds) return null;
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const query = {
    bound_sw_lat: sw.lat(),
    bound_sw_lng: sw.lng(),
    bound_ne_lat: ne.lat(),
    bound_ne_lng: ne.lng(),
  };
  if (!Object.values(query).every((value) => Number.isFinite(value))) return null;
  if (query.bound_sw_lat === query.bound_ne_lat && query.bound_sw_lng === query.bound_ne_lng) return null;
  return query;
}

async function fetchVisibleChurches() {
  const query = boundsQuery();
  if (!query) return;

  const key = [
    query.bound_sw_lat,
    query.bound_sw_lng,
    query.bound_ne_lat,
    query.bound_ne_lng,
  ]
    .map((value) => value.toFixed(4))
    .join(",");
  if (key === lastBoundsKey) return;
  lastBoundsKey = key;

  loading.value = true;
  try {
    const response = await churchService.getMapLocations(query, false);
    if (disposed) return;
    parseOmrMapChurches(response).forEach(addChurch);
  } catch (error) {
    console.error(error);
    if (!disposed) lastBoundsKey = "";
  } finally {
    if (!disposed) loading.value = false;
  }
}

function scheduleFetch() {
  window.clearTimeout(fetchTimer);
  fetchTimer = window.setTimeout(() => {
    void fetchVisibleChurches();
  }, 350);
}

function currentPosition() {
  if (!navigator.geolocation) return Promise.resolve(null);
  return new Promise<{ lat: number; lng: number } | null>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  });
}

async function countryName() {
  const user = authStore.user as Record<string, unknown> | null;
  if (!user) return "";

  if (typeof user.country_name === "string" && user.country_name.trim()) {
    return user.country_name.trim();
  }

  const nested = user.country;
  if (nested && typeof nested === "object" && typeof (nested as { name?: unknown }).name === "string") {
    const name = (nested as { name: string }).name.trim();
    if (name) return name;
  }

  if (user.country_id == null || user.country_id === "") return "";

  try {
    const response = await countryService.getById(user.country_id as string | number, false);
    const record = (response?.data ?? response) as { name?: unknown } | null;
    return typeof record?.name === "string" ? record.name.trim() : "";
  } catch (error) {
    console.error(error);
    return "";
  }
}

function geocodeAddress(address: string) {
  return new Promise<{ lat: number; lng: number; viewport?: { getSouthWest: () => unknown } } | null>(
    (resolve) => {
      if (!window.google?.maps.Geocoder) {
        resolve(null);
        return;
      }
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        const first = results?.[0];
        if (status !== "OK" || !first) {
          resolve(null);
          return;
        }
        resolve({
          lat: first.geometry.location.lat(),
          lng: first.geometry.location.lng(),
          viewport: first.geometry.viewport,
        });
      });
    },
  );
}

function waitForIdle() {
  return new Promise<void>((resolve) => {
    const timer = window.setTimeout(resolve, 800);
    if (!map || !window.google?.maps.event) return;
    window.google.maps.event.addListenerOnce(map, "idle", () => {
      window.clearTimeout(timer);
      resolve();
    });
  });
}

async function focusMap() {
  if (!map) return;

  const here = await currentPosition();
  if (disposed || !map) return;

  if (here) {
    map.setCenter(here);
    map.setZoom(12);
    await waitForIdle();
    return;
  }

  const nation = await countryName();
  if (disposed || !map) return;

  const place = nation ? await geocodeAddress(nation) : null;
  if (disposed || !map) return;

  if (place?.viewport) {
    map.fitBounds(place.viewport as Parameters<GoogleMapInstance["fitBounds"]>[0]);
  } else if (place) {
    map.setCenter({ lat: place.lat, lng: place.lng });
    map.setZoom(6);
  } else {
    map.setCenter(WORLD_CENTER);
    map.setZoom(3);
  }
  await waitForIdle();
}

async function initMap() {
  mapError.value = "";
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  if (!mapEl.value) return;

  try {
    await loadGoogleMaps(apiKey);
  } catch (error) {
    console.error(error);
    mapError.value = t("church.mapLoadError");
    return;
  }

  if (disposed || !mapEl.value || !window.google) return;

  map = new window.google.maps.Map(mapEl.value, {
    center: WORLD_CENTER,
    zoom: 3,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    gestureHandling: "greedy",
    clickableIcons: false,
  });
  const overlay = new window.google.maps.OverlayView();
  overlay.onAdd = () => {};
  overlay.draw = () => {
    if (!hoverChurch.value) return;
    const entry = markerEntries.get(hoverChurch.value.id);
    if (entry) placeHover(entry);
  };
  overlay.onRemove = () => {};
  overlay.setMap(map);
  projectionOverlay = overlay;

  await focusMap();
  if (disposed || !map) return;

  window.google.maps.event.addListener(map, "idle", scheduleFetch);
  window.google.maps.event.addListener(map, "bounds_changed", scheduleFetch);
  scheduleFetch();
}

onMounted(() => {
  void initMap();
});

onBeforeUnmount(() => {
  disposed = true;
  window.clearTimeout(fetchTimer);
  window.clearTimeout(hoverTimer);
  projectionOverlay?.setMap(null);
  projectionOverlay = null;
  if (map) window.google?.maps.event.clearInstanceListeners(map);
  markerEntries.forEach((entry) => entry.marker.setMap(null));
  markerEntries.clear();
  map = null;
});
</script>

<template>
  <div class="omr-map-screen">
    <v-row class="my-2">
      <v-col
        cols="12"
        md="6"
        class="d-flex align-center"
      >
        <div class="text-h4 font-weight-medium">
          {{ t("mainMenu.omrMap") }}
        </div>
      </v-col>
    </v-row>

    <div class="omr-map-page">
    <div
      ref="mapEl"
      class="omr-map-canvas"
    />

    <div
      v-if="hoverChurch"
      class="omr-map-tooltip"
      :style="{ left: `${hoverPoint.x}px`, top: `${hoverPoint.y}px` }"
    >
      <div class="omr-map-tooltip__title">{{ displayValue(hoverChurch.name) }}</div>
      <div class="omr-map-tooltip__body">
        <div class="omr-map-tooltip__row">
          <span class="omr-map-tooltip__label">{{ t("omrMap.address") }}</span>
          <span class="omr-map-tooltip__value">{{ hoverChurch.address.trim() ? hoverChurch.address : "-" }}</span>
        </div>
        <div class="omr-map-tooltip__row">
          <span class="omr-map-tooltip__label">{{ t("omrMap.attendance") }}</span>
          <span class="omr-map-tooltip__value">{{ hoverChurch.attendance }}</span>
        </div>
      </div>
    </div>

    <div
      v-if="mapError"
      class="omr-map-error"
    >
      {{ mapError }}
    </div>

    <div
      v-if="loading && !mapError"
      class="omr-map-loading"
    >
      <v-progress-circular
        indeterminate
        size="16"
        width="2"
        color="primary"
      />
      <span>{{ t("omrMap.loading") }}</span>
    </div>

    <aside
      v-if="selected"
      class="omr-map-panel"
    >
      <div class="omr-map-panel__header">
        <router-link
          class="omr-map-panel__name"
          :to="{ name: 'ChurchDetail', params: { id: selected.id } }"
        >
          {{ displayValue(selected.name) }}
        </router-link>
        <v-btn
          icon="$closeCircle"
          variant="text"
          color="primary"
          size="small"
          :aria-label="t('close')"
          @click="closePanel"
        />
      </div>

      <div
        v-if="selected.short_name"
        class="omr-map-panel__short"
      >
        {{ selected.short_name }}
      </div>

      <dl class="omr-map-panel__details">
        <div>
          <dt>{{ t("omrMap.address") }}</dt>
          <dd>{{ displayValue(selected.address) }}</dd>
        </div>
        <div>
          <dt>{{ t("omrMap.city") }}</dt>
          <dd>{{ displayValue(selected.city) }}</dd>
        </div>
        <div>
          <dt>{{ t("omrMap.attendance") }}</dt>
          <dd>{{ selected.attendance }}</dd>
        </div>
      </dl>
    </aside>

    <div
      v-if="!mapError"
      class="omr-map-legend"
    >
      <div class="omr-map-legend__title">{{ t("omrMap.legend") }}</div>
      <div
        v-for="band in ATTENDANCE_BANDS"
        :key="band.labelKey"
        class="omr-map-legend__row"
      >
        <span
          class="omr-map-swatch"
          :style="{ background: band.color }"
        />
        <span>{{ t(band.labelKey) }}</span>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped lang="scss">
.omr-map-screen {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--v-layout-top, 70px) - 120px);
  min-height: 560px;
}

.omr-map-screen > .v-row {
  flex: 0 0 auto;
}

.omr-map-page {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  border-radius: 12px;
  background: #d9e2ec;
}

.omr-map-canvas {
  position: absolute;
  inset: 0;
}

.omr-map-tooltip {
  position: absolute;
  z-index: 4;
  width: max-content;
  max-width: 260px;
  padding: 10px 12px 12px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(20, 35, 55, 0.18);
  pointer-events: none;
  transform: translate(-50%, calc(-100% - 12px));
}

.omr-map-tooltip::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -6px;
  transform: translateX(-50%);
  border-width: 6px 6px 0;
  border-style: solid;
  border-color: #fff transparent transparent;
}

.omr-map-tooltip__title {
  color: #1f2a37;
  font-size: 14px;
  font-weight: 650;
  line-height: 1.35;
}

.omr-map-tooltip__body {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e6ebf0;
}

.omr-map-tooltip__row + .omr-map-tooltip__row {
  margin-top: 8px;
}

.omr-map-tooltip__label {
  display: block;
  margin-bottom: 2px;
  color: #7b8794;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.2;
  text-transform: uppercase;
}

.omr-map-tooltip__value {
  color: #1f2a37;
  font-size: 13px;
  line-height: 1.4;
}

.omr-map-error,
.omr-map-loading {
  position: absolute;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(20, 35, 55, 0.16);
}

.omr-map-error {
  top: 16px;
  left: 16px;
  right: 16px;
  width: fit-content;
  max-width: calc(100% - 32px);
  padding: 10px 14px;
  color: #8a2b24;
}

.omr-map-loading {
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 14px;
  color: #1f2a37;
  font-size: 0.875rem;
}

.omr-map-panel {
  position: absolute;
  z-index: 2;
  top: 12px;
  bottom: 12px;
  left: 12px;
  width: min(340px, calc(100% - 24px));
  overflow: auto;
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(20, 35, 55, 0.18);
}

.omr-map-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.omr-map-panel__name {
  color: #1a73c7;
  font-size: 1.05rem;
  font-weight: 650;
  line-height: 1.35;
  text-decoration: none;
}

.omr-map-panel__short {
  margin-top: 4px;
  color: #5c6b7a;
}

.omr-map-panel__details {
  margin: 16px 0 0;
}

.omr-map-panel__details > div + div {
  margin-top: 12px;
}

.omr-map-panel__details dt {
  color: #5c6b7a;
  font-size: 0.75rem;
}

.omr-map-panel__details dd {
  margin: 2px 0 0;
  color: #1f2a37;
  line-height: 1.4;
}

.omr-map-legend {
  position: absolute;
  z-index: 2;
  left: 12px;
  bottom: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 4px 16px rgba(20, 35, 55, 0.16);
  font-size: 0.75rem;
  color: #1f2a37;
}

.omr-map-page:has(.omr-map-panel) .omr-map-legend {
  left: 364px;
}

.omr-map-legend__title {
  margin-bottom: 6px;
  font-weight: 650;
}

.omr-map-legend__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.omr-map-legend__row + .omr-map-legend__row {
  margin-top: 4px;
}

.omr-map-swatch {
  width: 12px;
  height: 12px;
  flex: 0 0 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
}

@media (max-width: 720px) {
  .omr-map-page:has(.omr-map-panel) .omr-map-legend {
    display: none;
  }
}
</style>
