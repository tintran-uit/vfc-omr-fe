<script setup lang="ts">
import { createFormSchema } from '@/form-schemas/addChurchTypeFormSchema';
import { churchTypeService } from '@/services/churchTypeService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useRouter } from 'vue-router'

const router = useRouter()
const formSchema = createFormSchema();

const handleSubmit = async (formData) => {
  try {
    await churchTypeService.create(formData)

    router.push({ name: 'ChurchTypeList' });
  } catch (e) {
    console.log('error', e);
  }
}
</script>

<template>
  <FormPageShell
    title-key="churchType.addTitle"
    :back-url="{ name: 'ChurchTypeList' }"
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