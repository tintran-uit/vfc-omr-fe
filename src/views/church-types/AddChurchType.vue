<script setup lang="ts">
import { createFormSchema } from '@/form-schemas/addChurchTypeFormSchema';
import { churchTypeService } from '@/services/churchTypeService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { useMessageStore } from '@/stores/messageStore';
import { extractApiError } from '@/utils/formErrors';
import { ref } from 'vue'

const router = useRouter()
const { t } = useI18n();
const messageStore = useMessageStore();
const formSchema = createFormSchema();
const formRef = ref();

const handleSubmit = async (formData) => {
  try {
    await churchTypeService.create(formData)

    router.push({ name: 'ChurchTypeList' });
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
    title-key="churchType.addTitle"
    :back-url="{ name: 'ChurchTypeList' }"
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