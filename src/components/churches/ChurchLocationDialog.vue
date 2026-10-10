<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { churchService } from "@/services/churchService";
import {
  loadGoogleMaps,
  type GoogleMapInstance,
  type GoogleMarkerInstance,
} from "@/services/googleMapsLoader";
import { useMessageStore } from "@/stores/messageStore";

const open = defineModel<boolean>({ default: false });

const props = withDefaults(
  defineProps<{
    mode: "pick" | "view";
    churchId?: string | number | null;
    latitude?: number | null;
    longitude?: number | null;
  }>(),
  {
    churchId: null,
    latitude: null,
    longitude: null,
  },
);

const emit = defineEmits<{
  saved: [coordinates: { latitude: number; longitude: number }];
}>();

const { t } = useI18n();
const messageStore = useMessageStore();

const FALLBACK_CENTER = { lat: 10.7769, lng: 106.7009 };

const mapEl = ref<HTMLElement | null>(null);
const mapError = ref("");
const saving = ref(false);
const coordinates = ref<{ lat: number; lng: number } | null>(null);

let map: GoogleMapInstance | null = null;
let marker: GoogleMarkerInstance | null = null;
let locateRequest = 0;

const coordinateLabel = computed(() => {
  if (!coordinates.value) return "";
  return `${coordinates.value.lat.toFixed(6)}, ${coordinates.value.lng.toFixed(6)}`;
});

function placeMarker(position: { lat: number; lng: number }, draggable: boolean) {
  if (!map || !window.google) return;

  if (!marker) {
    marker = new window.google.maps.Marker({
      position,
      map,
      draggable,
    });
    marker.addListener("dragend", () => {
      const next = marker?.getPosition();
      if (!next) return;
      coordinates.value = { lat: next.lat(), lng: next.lng() };
    });
  } else {
    marker.setMap(map);
    marker.setPosition(position);
  }

  coordinates.value = position;
}

async function initMap() {
  mapError.value = "";
  coordinates.value = null;
  marker = null;
  map = null;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  try {
    await loadGoogleMaps(apiKey);
  } catch (error) {
    console.error(error);
    mapError.value = t("church.mapLoadError");
    return;
  }

  await nextTick();
  if (!open.value || !mapEl.value || !window.google) return;

  const pointLatitude = Number(props.latitude);
  const pointLongitude = Number(props.longitude);
  const hasPoint =
    props.latitude != null &&
    props.longitude != null &&
    Number.isFinite(pointLatitude) &&
    Number.isFinite(pointLongitude);
  const center = hasPoint
    ? { lat: pointLatitude, lng: pointLongitude }
    : FALLBACK_CENTER;

  map = new window.google.maps.Map(mapEl.value, {
    center,
    zoom: hasPoint ? 16 : 12,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy",
  });

  if (props.mode === "view" && hasPoint) {
    placeMarker(center, false);
    return;
  }

  map.addListener("click", (event) => {
    const latLng = event?.latLng;
    if (!latLng) return;
    placeMarker({ lat: latLng.lat(), lng: latLng.lng() }, true);
  });

  if (hasPoint) {
    placeMarker(center, true);
    return;
  }

  const requestId = ++locateRequest;
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (!open.value || requestId !== locateRequest || !map) return;
      const next = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      map.setCenter(next);
      map.setZoom(16);
      placeMarker(next, true);
    },
    () => {},
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
  );
}

async function onSave() {
  if (!coordinates.value) return;

  const payload = {
    latitude: coordinates.value.lat,
    longitude: coordinates.value.lng,
  };

  if (props.churchId == null) {
    emit("saved", payload);
    open.value = false;
    return;
  }

  saving.value = true;
  try {
    await churchService.update(props.churchId, payload);
    emit("saved", payload);
    open.value = false;
  } catch (error) {
    console.error(error);
    messageStore.error(t("church.locationSaveError"));
  } finally {
    saving.value = false;
  }
}

watch(open, (isOpen) => {
  if (!isOpen) {
    locateRequest += 1;
    marker = null;
    map = null;
    coordinates.value = null;
    mapError.value = "";
  }
});
</script>

<template>
  <v-dialog
    v-model="open"
    max-width="840"
    :persistent="mode === 'pick'"
    @after-enter="initMap"
  >
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        {{ mode === "pick" ? $t("church.addLocation") : $t("church.location") }}
      </v-card-title>

      <div class="church-location-dialog__map-wrap">
        <div
          ref="mapEl"
          class="church-location-dialog__map"
        />
        <div
          v-if="mode === 'pick'"
          class="church-location-dialog__hint"
        >
          <div class="text-subtitle-1 font-weight-bold">
            {{ $t("church.addLocation") }}
          </div>
          <div class="text-body-2">
            {{ $t("church.addLocationHint") }}
          </div>
        </div>
        <div
          v-if="mapError"
          class="church-location-dialog__error text-body-2"
        >
          {{ mapError }}
        </div>
      </div>

      <div
        v-if="coordinateLabel"
        class="text-center text-body-1 py-3"
      >
        {{ coordinateLabel }}
      </div>

      <div class="d-flex ga-3 px-4 pb-4">
        <template v-if="mode === 'pick'">
          <v-btn
            variant="outlined"
            class="flex-grow-1"
            :disabled="saving"
            @click="open = false"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            color="primary"
            class="flex-grow-1"
            :disabled="!coordinates"
            :loading="saving"
            @click="onSave"
          >
            {{ $t("church.saveLocation") }}
          </v-btn>
        </template>
        <v-btn
          v-else
          variant="outlined"
          class="flex-grow-1"
          @click="open = false"
        >
          {{ $t("close") }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.church-location-dialog__map-wrap {
  position: relative;
  height: 460px;
  background: #e8eef3;
}

.church-location-dialog__map {
  width: 100%;
  height: 100%;
}

.church-location-dialog__hint {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  max-width: min(360px, calc(100% - 24px));
  padding: 12px 14px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.church-location-dialog__error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.92);
}
</style>
