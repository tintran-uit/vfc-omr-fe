<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { createFormSchema } from '@/form-schemas/addChurchFormSchema';
import {churchService} from '@/services/churchService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const formSchema = createFormSchema();
const defaultData = ref({})

async function fetchDefaultData() {
  defaultData.value = await churchService.getDefaultFormData()
}

const handleSubmit = async (formData) => {
  try {
    await churchService.create(formData)

    router.push({ name: 'ChurchList' });
  } catch (e) {
    console.log('error', e);
  }
}

onMounted(() => {
  fetchDefaultData()
})
</script>

<template>
  <DynamicFormDefault
    :form-schema="formSchema"
    @submit="handleSubmit"
    :init-data="defaultData"
    :page-title="$t('church.addTitle')"
    :back-url="{ name: 'ChurchList' }"
  >
  </DynamicFormDefault>
</template>

<style scoped lang="scss">

</style>