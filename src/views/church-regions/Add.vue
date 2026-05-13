<script setup lang="ts">
import { useRouter } from 'vue-router'
import { createFormSchema } from '@/form-schemas/addChurchRegionFormSchema'
import { churchRegionService } from '@/services/churchRegionService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import FormPageShell from "@/components/shared/FormPageShell.vue";

defineOptions({ name: "ChurchRegionsAdd" });

const router = useRouter()
const formSchema = createFormSchema();

const handleSubmit = async (formData) => {
  try {
    await churchRegionService.create(formData)

    router.push({ name: 'ChurchRegionsList' });
  } catch (e) {
    console.log('error', e);
  }
}
</script>

<template>
  <FormPageShell
    title-key="churchRegions.addTitle"
    :back-url="{ name: 'ChurchRegionsList' }"
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