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

const editProjectionRoute = computed(() => ({
  name: 'PlantingProjectionEdit' as const,
  params: { churchId: String(churchId.value), id: String(projectionId.value) },
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
  <v-container class="py-4 py-md-6" :fluid="true">
    <v-row v-if="loading" justify="center" class="py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
    </v-row>

    <v-alert
      v-else-if="loadError"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ t('churchPlantingProjection.editLoadError') }}
      <v-btn class="ms-2" size="small" variant="tonal" @click="goList">
        {{ t('backToList') }}
      </v-btn>
    </v-alert>

    <template v-else-if="editData">
      <v-row class="mb-2" align="center" justify="space-between">
        <v-col cols="12" class="d-flex flex-wrap align-center ga-2">
          <v-icon color="error" size="32">$calendar</v-icon>
          <h1 class="text-h4 font-weight-medium text-primary">
            {{ t('churchPlantingProjection.editStepsPageTitle') }}
          </h1>
        </v-col>
        <v-col cols="12" class="d-flex flex-wrap justify-end ga-2">
          <v-btn color="primary" variant="outlined" :to="editProjectionRoute">
            <v-icon start size="18">$edit</v-icon>
            {{ t('churchPlantingProjection.editProjectionBtn') }}
          </v-btn>
          <v-btn color="primary" variant="outlined" @click="goList">
            <v-icon start>$arrowLeft</v-icon>
            {{ t('backToList') }}
          </v-btn>
        </v-col>
      </v-row>

      <v-card variant="flat" class="mt-2 bg-transparent elevation-0">
        <v-card-text class="pa-0">
          <EditStepsForm
            :key="`cpp-steps-${projectionId}`"
            :projection-id="projectionId"
            :subheading="stepsSubheading"
            @saved="onStepsSaved"
          />
        </v-card-text>
      </v-card>
    </template>
  </v-container>
</template>

<style scoped lang="scss"></style>
