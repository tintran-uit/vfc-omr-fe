<script setup lang="ts">
import { ref, onMounted } from "vue";
import { createFormSchema } from "@/form-schemas/editUserFormSchema";
import { userService as service } from "@/services/userService";
import DynamicFormDefault from "@/components/forms/DynamicFormDefault.vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMessageStore } from "@/stores/messageStore";
import { extractApiError } from "@/utils/formErrors";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const messageStore = useMessageStore();
const options = ref({});
const id = route.params.id as string;
const editData = ref(null);
const formSchema = createFormSchema();
const formRef = ref();

async function loadOptions() {
  options.value = await service.getFormData();
}

async function fetchEditData(userId: string) {
  if (!userId) return;
  try {
    editData.value = await service.get(userId);
  } catch (e) {
    console.log("error", e);
  }
}

async function handleSubmit(formData: Record<string, unknown>) {
  try {
    await service.update(id, formData);
    router.push({ name: "UserList" });
  } catch (e) {
    const { errors } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(t("genericSaveError"));
    }
  }
}

function mapperFn(source: Record<string, unknown>, destination: Record<string, unknown>) {
  destination.role_id = source.role ? (source.role as { id: number }).id : null;
}

onMounted(() => {
  loadOptions();
  fetchEditData(id);
});
</script>

<template>
  <DynamicFormDefault
    ref="formRef"
    :options="options"
    :form-schema="formSchema"
    :init-data="editData"
    :mapper="mapperFn"
    :page-title="$t('user.editTitle', { id })"
    :back-url="{ name: 'UserList' }"
    @submit="handleSubmit"
  />
</template>
