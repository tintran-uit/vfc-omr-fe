<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import { createEditChurchPlantingProjectionFormSchema } from '@/form-schemas/editChurchPlantingProjectionFormSchema';
import { churchPlantingProjectionService } from '@/services/churchPlantingProjectionService';
import { useAuthStore } from '@/stores/authStore';
import { useMessageStore } from '@/stores/messageStore';
import { extractApiError } from '@/utils/formErrors';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const messageStore = useMessageStore();

const churchId = computed(() => Number(route.params.churchId));
const projectionId = computed(() => Number(route.params.id));

const formSchema = createEditChurchPlantingProjectionFormSchema();
const formRef = ref();
const options = ref({
  distanceUnits: [
    { title: 'km', value: 'km' },
    { title: 'miles', value: 'miles' },
  ],
});

const editData = ref<Record<string, any> | null>(null);
const loadError = ref(false);
const loading = ref(true);

const listRoute = computed(() => ({
  name: 'PlantingProjectionList' as const,
  params: { churchId: String(churchId.value) },
}));

const editStepsRoute = computed(() => ({
  name: 'PlantingProjectionEditSteps' as const,
  params: { churchId: String(churchId.value), id: String(projectionId.value) },
}));

const pageTitle = computed(() =>
  t('churchPlantingProjection.editTitle', { id: projectionId.value })
);

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

function buildPatchBody(form: Record<string, any>, projection: Record<string, any>) {
  return {
    church_id: churchId.value,
    town: form.town,
    country_id: form.country_id,
    proposed_church_name: form.proposed_church_name,
    proposed_leader_name: form.proposed_leader_name,
    population:
      form.population != null && form.population !== ''
        ? Number(form.population)
        : null,
    start_date_preparation: form.start_date_preparation,
    start_date_preparation_original: form.start_date_preparation_original,
    start_date_pioneering: form.start_date_pioneering,
    start_date_pioneering_original: form.start_date_pioneering_original,
    distance_to_town: String(form.distance_to_town ?? ''),
    distance_to_town_unit: form.distance_to_town_unit || 'km',
    user_id: projection.user_id ?? authStore.user?.id,
  };
}

const handleSubmit = async (formData: Record<string, any>) => {
  if (!editData.value) return;
  try {
    await churchPlantingProjectionService.update(
      String(projectionId.value),
      buildPatchBody(formData, editData.value)
    );
    messageStore.info(t('churchPlantingProjection.infoSaved'));
    router.push(listRoute.value);
  } catch (e) {
    const { errors } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(t('churchPlantingProjection.editSaveError'));
    }
  }
};

function goList() {
  router.push(listRoute.value);
}
</script>

<template>
    <DynamicFormDefault
      ref="formRef"
      :form-schema="formSchema"
      :options="options"
      :init-data="editData"
      :meta="{}"
      :page-title="pageTitle"
      :back-url="listRoute"
      @submit="handleSubmit"
    >
      <template #header-right>
        <div class="d-flex flex-wrap justify-md-end ga-2">
          <v-btn color="primary" variant="outlined" :to="editStepsRoute">
            <v-icon start size="18">$edit</v-icon>
            {{ t('churchPlantingProjection.editStepsBtn') }}
          </v-btn>
          <v-btn color="primary" variant="outlined" @click="goList">
            <v-icon>$arrowLeft</v-icon> {{ t('backToList') }}
          </v-btn>
        </div>
      </template>
    </DynamicFormDefault>
</template>

<style scoped lang="scss"></style>
