<script setup lang="ts">
import { createFormSchema } from '@/form-schemas/addCountryFormSchema';
import { countryService } from '@/services/countryService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useRouter } from 'vue-router'

const router = useRouter()
const formSchema = createFormSchema();

const handleSubmit = async (formData) => {
  try {
    await countryService.create(formData)

    router.push({ name: 'CountryList' });
  } catch (e) {
    console.log('error', e);
  }
}
</script>

<template>
  <FormPageShell
    title-key="country.addTitle"
    :back-url="{ name: 'CountryList' }"
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