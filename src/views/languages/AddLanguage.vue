<script setup lang="ts">
import { createFormSchema } from '@/form-schemas/addLanguageFormSchema';
import { languageService } from '@/services/languageService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useRouter } from 'vue-router'

const router = useRouter()
const formSchema = createFormSchema();

const handleSubmit = async (formData) => {
  try {
    await languageService.create(formData)

    router.push({ name: 'LanguageList' });
  } catch (e) {
    console.log('error', e);
  }
}
</script>

<template>
  <FormPageShell
    title-key="language.addTitle"
    :back-url="{ name: 'LanguageList' }"
  >
    <DynamicFormDefault
      :form-schema="formSchema"
      form-only
      hide-form-header
      @submit="handleSubmit"
    />
  </FormPageShell>
</template>

<style scoped lang="scss">

</style>