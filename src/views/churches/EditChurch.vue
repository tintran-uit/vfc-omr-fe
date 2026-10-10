<script setup lang="ts">
import { computed, provide, ref, onMounted, watch } from "vue";
import { createFormSchema } from "@/form-schemas/addChurchFormSchema";
import { churchService } from "@/services/churchService";
import DynamicFormDefault from "@/components/forms/DynamicFormDefault.vue";
import {
  readChurchCoordinates,
  type ChurchCoordinates,
} from "@/helpers/churchCoordinates";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMessageStore } from "@/stores/messageStore";
import { extractApiError } from "@/utils/formErrors";

const route = useRoute();
const { t } = useI18n();
const messageStore = useMessageStore();
const id = route.params.id as string;
const editData = ref<Record<string, unknown> | null>(null);
const coordinates = ref<ChurchCoordinates | null>(null);
const openChurchMap = ref<() => void>(() => {});
const formSchema = createFormSchema();
const mapField = formSchema.fields.find((field) => field.type === "ChurchMapInput");
if (mapField) mapField.persistLocation = true;
const formRef = ref();

const showMissingLocation = computed(() => !!editData.value && !coordinates.value);

provide("syncChurchCoordinates", (next: ChurchCoordinates | null) => {
  coordinates.value = next;
});
provide("registerChurchMapOpener", (open: () => void) => {
  openChurchMap.value = open;
});

watch(editData, (church) => {
  coordinates.value = readChurchCoordinates(church);
});

async function fetchEditData(churchId: string) {
  if (!churchId) return;
  try {
    const response = await churchService.get(churchId);
    editData.value = response?.data ?? response;
  } catch (e) {
    console.log("error", e);
  }
}

async function handleSubmit(formData: Record<string, unknown>) {
  try {
    await churchService.update(id, formData);
  } catch (e) {
    const { errors } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(t("genericSaveError"));
    }
  }
}

onMounted(() => {
  fetchEditData(id);
});
</script>

<template>
  <DynamicFormDefault
    ref="formRef"
    :form-schema="formSchema"
    :init-data="editData"
    :page-title="$t('church.editTitle', { id })"
    :back-url="{ name: 'ChurchList' }"
    @submit="handleSubmit"
  >
    <template #prepend>
      <div
        v-if="showMissingLocation"
        class="church-location-banner"
      >
        <span>{{ t("church.missingMapLocation") }}</span>
        <button
          type="button"
          class="church-location-banner__action"
          @click="openChurchMap()"
        >
          {{ t("church.addLocation") }}
        </button>
      </div>
    </template>
  </DynamicFormDefault>
</template>

<style scoped lang="scss">
.church-location-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fff4d6;
  color: #6a5420;
  font-size: 0.95rem;
  line-height: 1.4;
}

.church-location-banner__action {
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: #1a73c7;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
</style>
