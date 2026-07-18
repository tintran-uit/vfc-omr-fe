<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import EditStepsForm from '@/views/planting-projections/EditStepsForm.vue';
import { churchPlantingProjectionService } from '@/services/churchPlantingProjectionService';
import { useMessageStore } from '@/stores/messageStore';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const messageStore = useMessageStore();

const churchId = computed(() => Number(route.params.churchId));
const projectionId = computed(() => Number(route.params.id));

const editData = ref<Record<string, any> | null>(null);
const loadError = ref(false);
const loading = ref(true);

const listRoute = computed(() => ({
  name: 'PlantingProjectionList' as const,
  params: { churchId: String(churchId.value) },
}));

const stepsSubheading = computed(() => {
  const p = editData.value;
  if (!p) return '';
  return [p.proposed_church_name, p.town].filter(Boolean).join(', ') || p.proposed_church_name || '';
});

function normalizeProjectionResponse(raw: any) {
  if (!raw || typeof raw !== 'object') return null;
  return (raw as { data?: unknown }).data != null
    ? (raw as { data: Record<string, any> }).data
    : (raw as Record<string, any>);
}

async function fetchProjection() {
  loading.value = true;
  loadError.value = false;
  editData.value = null;
  try {
    const raw = await churchPlantingProjectionService.get(String(projectionId.value), true);
    const p = normalizeProjectionResponse(raw);
    if (!p || p.id == null) {
      loadError.value = true;
      return;
    }
    if (Number(p.id) !== projectionId.value) {
      loadError.value = true;
      return;
    }
    if (Number(p.church_id) !== churchId.value) {
      loadError.value = true;
      return;
    }
    editData.value = p;
  } catch (e) {
    console.error(e);
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (!Number.isFinite(projectionId.value) || !Number.isFinite(churchId.value)) {
    loadError.value = true;
    loading.value = false;
    return;
  }
  fetchProjection();
});

watch(
  () => [route.params.id, route.params.churchId] as const,
  () => {
    if (!Number.isFinite(projectionId.value) || !Number.isFinite(churchId.value)) return;
    fetchProjection();
  }
);

function goList() {
  router.push(listRoute.value);
}

function onStepsSaved() {
  messageStore.info(t('churchPlantingProjection.stepsSaved'));
  router.push(listRoute.value);
}
</script>

<template>
  <v-row
    v-if="loading"
    justify="center"
    class="py-12"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="48"
    />
  </v-row>

  <v-alert
    v-else-if="loadError"
    type="error"
    variant="tonal"
    class="mb-4"
  >
    {{ t('churchPlantingProjection.editLoadError') }}
    <v-btn
      class="ms-2"
      size="small"
      variant="tonal"
      @click="goList"
    >
      {{ t('backToList') }}
    </v-btn>
  </v-alert>

  <template v-else-if="editData">
    <v-row class="my-2">
      <v-col
        cols="12"
        md="6"
        class="d-flex align-center"
      >
        <div class="text-h4 font-weight-medium">
          {{ t('churchPlantingProjection.editStepsPageTitle') }}
          <span
            v-if="stepsSubheading"
            class="text-body-1 text-medium-emphasis d-block mt-1 text-wrap"
          >
            {{ stepsSubheading }}
          </span>
        </div>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <div class="d-flex justify-md-end">
          <v-btn
            color="primary"
            variant="outlined"
            @click="goList"
          >
            <v-icon>$arrowLeft</v-icon> {{ t('backToList') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-card
      variant="outlined"
      class="bg-surface"
    >
      <v-card-text>
        <EditStepsForm
          :key="`cpp-steps-${projectionId}`"
          :projection-id="projectionId"
          @saved="onStepsSaved"
        />
      </v-card-text>
    </v-card>
  </template>
</template>

<style scoped lang="scss"></style>
