<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { createFormSchema } from '@/form-schemas/addGeographicalRegionFormSchema';
import { geographicalRegionService } from '@/services/geographicalRegionService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useRouter, useRoute } from 'vue-router'

defineOptions({ name: "GeographicalRegionsEdit" });

const router = useRouter()
const route = useRoute()
const id = computed(() => route.params.id);
const formSchema = createFormSchema();
const editData = ref(null);

const fetchEditData = async function (id) {
  if (!id) return;
  try {
    const data = await geographicalRegionService.getById(id);
    
    editData.value = data;
  } catch (e) {
    console.log('error', e);
  }
}

const handleSubmit = async (formData) => {
  try {
    await geographicalRegionService.update(id.value, formData)

    router.push({ name: 'GeographicalRegionsList' });
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
    :title="$t('geographicalRegions.editTitle', { id: id })"
    :back-url="{ name: 'GeographicalRegionsList' }"
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