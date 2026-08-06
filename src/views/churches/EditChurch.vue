<script setup lang="ts">
import { ref, onMounted } from "vue";
import { createFormSchema } from "@/form-schemas/addChurchFormSchema";
import { churchService } from "@/services/churchService";
import DynamicFormDefault from "@/components/forms/DynamicFormDefault.vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMessageStore } from "@/stores/messageStore";
import { extractApiError } from "@/utils/formErrors";

const route = useRoute();
const { t } = useI18n();
const messageStore = useMessageStore();
const id = route.params.id as string;
const editData = ref(null);
const formSchema = createFormSchema();
const formRef = ref();

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
  />
</template>
