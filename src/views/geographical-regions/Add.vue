<script setup lang="ts">
import { useRouter } from 'vue-router'
import { createFormSchema } from '@/form-schemas/addGeographicalRegionFormSchema'
import { geographicalRegionService } from '@/services/geographicalRegionService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useI18n } from 'vue-i18n';
import { useMessageStore } from '@/stores/messageStore';
import { extractApiError } from '@/utils/formErrors';
import { ref } from 'vue'

defineOptions({ name: "GeographicalRegionsAdd" });

const router = useRouter()
const { t } = useI18n();
const messageStore = useMessageStore();
const formSchema = createFormSchema();
const formRef = ref();

const handleSubmit = async (formData) => {
  try {
    await geographicalRegionService.create(formData)

    router.push({ name: 'GeographicalRegionsList' });
  } catch (e) {
    const { errors } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(t('genericSaveError'));
    }
  }
}
</script>

<template>
  <FormPageShell
    title-key="geographicalRegions.addTitle"
    :back-url="{ name: 'GeographicalRegionsList' }"
  >
    <DynamicFormDefault
      ref="formRef"
      :form-schema="formSchema"
      form-only
      hide-form-header
      @submit="handleSubmit"
    />
  </FormPageShell>
</template>

<style scoped lang="scss">

</style>