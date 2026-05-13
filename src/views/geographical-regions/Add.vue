<script setup lang="ts">
import { useRouter } from 'vue-router'
import { createFormSchema } from '@/form-schemas/addGeographicalRegionFormSchema'
import { geographicalRegionService } from '@/services/geographicalRegionService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import FormPageShell from "@/components/shared/FormPageShell.vue";

defineOptions({ name: "GeographicalRegionsAdd" });

const router = useRouter()
const formSchema = createFormSchema();

const handleSubmit = async (formData) => {
  try {
    await geographicalRegionService.create(formData)

    router.push({ name: 'GeographicalRegionsList' });
  } catch (e) {
    console.log('error', e);
  }
}
</script>

<template>
  <FormPageShell
    title-key="geographicalRegions.addTitle"
    :back-url="{ name: 'GeographicalRegionsList' }"
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