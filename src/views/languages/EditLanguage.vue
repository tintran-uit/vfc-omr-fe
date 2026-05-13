<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { createFormSchema } from '@/form-schemas/addLanguageFormSchema';
import { languageService } from '@/services/languageService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const id = computed(() => route.params.id);
const formSchema = createFormSchema();
const editData = ref(null);

const fetchEditData = async function (id) {
  if (!id) return;
  try {
    const data = await languageService.getById(id);
    
    editData.value = data;
  } catch (e) {
    console.log('error', e);
  }
}

const handleSubmit = async (formData) => {
  try {
    await languageService.update(id.value, formData)

    router.push({ name: 'LanguageList' });
  } catch (e) {
    console.log('error', e);
  }
}

watch(
  () => id.value,
  async (id) => {
    if (!id) return
    fetchEditData(id)
  },
  { immediate: true }
)
</script>

<template>
  <FormPageShell
    :title="$t('language.editTitle', { id: id })"
    :back-url="{ name: 'LanguageList' }"
  >
    <DynamicFormDefault
      :form-schema="formSchema"
      :init-data="editData"
      form-only
      hide-form-header
      @submit="handleSubmit"
    />
  </FormPageShell>
</template>

<style scoped lang="scss">

</style>