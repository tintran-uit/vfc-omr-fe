<script setup lang="ts">
import { ref } from 'vue';
import { createFormSchema } from '@/form-schemas/addCountryFormSchema';
import { countryService } from '@/services/countryService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { useMessageStore } from '@/stores/messageStore';
import { extractApiError } from '@/utils/formErrors';

const router = useRouter()
const { t } = useI18n();
const messageStore = useMessageStore();
const formSchema = createFormSchema();
const formRef = ref();

const handleSubmit = async (formData) => {
  try {
    await countryService.create(formData)

    router.push({ name: 'CountryList' });
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
    title-key="country.addTitle"
    :back-url="{ name: 'CountryList' }"
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
