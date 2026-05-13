<script setup lang="ts">
import { createFormSchema } from '@/form-schemas/addChurchNetworkFormSchema';
import { churchNetworkService } from '@/services/churchNetworkService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useRouter } from 'vue-router'

const router = useRouter()
const formSchema = createFormSchema();

const handleSubmit = async (formData) => {
  try {
    await churchNetworkService.create(formData)

    router.push({ name: 'ChurchNetworkList' });
  } catch (e) {
    console.log('error', e);
  }
}
</script>

<template>
  <FormPageShell
    title-key="churchNetwork.addTitle"
    :back-url="{ name: 'ChurchNetworkList' }"
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