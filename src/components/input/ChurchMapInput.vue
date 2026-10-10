<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import ChurchLocationDialog from "@/components/churches/ChurchLocationDialog.vue";
import { parseCoordinate, type ChurchCoordinates } from "@/helpers/churchCoordinates";
import { churchService } from "@/services/churchService";
import { useDialogStore } from "@/stores/dialogStore";
import { useMessageStore } from "@/stores/messageStore";

const props = withDefaults(
  defineProps<{
    latitude?: unknown;
    longitude?: unknown;
    churchId?: string | number | null;
    persist?: boolean;
  }>(),
  {
    latitude: null,
    longitude: null,
    churchId: null,
    persist: false,
  },
);

const emit = defineEmits<{
  confirm: [coordinates: { latitude: number | null; longitude: number | null }];
}>();

const { t } = useI18n();
const dialogStore = useDialogStore();
const messageStore = useMessageStore();
const dialog = ref(false);
const removing = ref(false);
const latitudeNumber = computed(() => parseCoordinate(props.latitude));
const longitudeNumber = computed(() => parseCoordinate(props.longitude));
const hasPoint = computed(() => latitudeNumber.value !== null && longitudeNumber.value !== null);

const registerOpener = inject<((open: () => void) => void) | null>("registerChurchMapOpener", null);
const syncChurchCoordinates = inject<((coordinates: ChurchCoordinates | null) => void) | null>(
  "syncChurchCoordinates",
  null,
);

function openDialog() {
  dialog.value = true;
}

function onSaved(coordinates: ChurchCoordinates) {
  syncChurchCoordinates?.(coordinates);
  emit("confirm", coordinates);
}

async function removeLocation() {
  if (!(await dialogStore.confirm(t("church.removeLocationConfirm")))) return;

  if (props.persist && props.churchId != null) {
    removing.value = true;
    try {
      await churchService.update(props.churchId, { latitude: null, longitude: null });
    } catch (error) {
      console.error(error);
      messageStore.error(t("church.locationSaveError"));
      removing.value = false;
      return;
    }
    removing.value = false;
  }

  syncChurchCoordinates?.(null);
  emit("confirm", { latitude: null, longitude: null });
}

onMounted(() => {
  registerOpener?.(openDialog);
});
</script>

<template>
  <div class="d-flex align-center flex-wrap ga-2">
    <template v-if="hasPoint">
      <v-chip
        size="small"
        variant="tonal"
        label
      >
        {{ t("church.latitudeShort") }} {{ latitudeNumber?.toFixed(6) }}
      </v-chip>
      <v-chip
        size="small"
        variant="tonal"
        label
      >
        {{ t("church.longitudeShort") }} {{ longitudeNumber?.toFixed(6) }}
      </v-chip>
      <v-btn
        icon="$edit"
        variant="text"
        color="primary"
        :aria-label="t('church.changeLocation')"
        :title="t('church.changeLocation')"
        @click="openDialog"
      />
      <v-btn
        icon="$delete"
        variant="text"
        color="error"
        :loading="removing"
        :aria-label="t('church.removeLocation')"
        :title="t('church.removeLocation')"
        @click="removeLocation"
      />
    </template>
    <v-btn
      v-else
      class="church-map-field__add"
      color="primary"
      variant="tonal"
      size="small"
      @click="openDialog"
    >
      {{ t("church.addLocation") }}
    </v-btn>
  </div>

  <ChurchLocationDialog
    v-model="dialog"
    mode="pick"
    :church-id="persist ? churchId : null"
    :latitude="latitudeNumber"
    :longitude="longitudeNumber"
    @saved="onSaved"
  />
</template>

<style scoped lang="scss">
.church-map-field__add {
  padding-inline: 12px;
}
</style>
