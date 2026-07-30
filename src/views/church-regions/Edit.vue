<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { createFormSchema } from '@/form-schemas/addChurchRegionFormSchema'
import { churchRegionService } from '@/services/churchRegionService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { useMessageStore } from '@/stores/messageStore';
import { extractApiError } from '@/utils/formErrors';

defineOptions({ name: "ChurchRegionsEdit" });

const router = useRouter()
const { t } = useI18n();
const messageStore = useMessageStore();
const route = useRoute()
const id = computed(() => route.params.id);
const formSchema = createFormSchema();
const formRef = ref();
const editData = ref(null);

const fetchEditData = async function (id) {
  if (!id) return;
  try {
    const data = await churchRegionService.getById(id);
    
    editData.value = data;
  } catch (e) {
    console.log('error', e);
  }
}

const handleSubmit = async (formData) => {
  try {
    await churchRegionService.update(id.value, formData)

    router.push({ name: 'ChurchRegionsList' });
  } catch (e) {
    const { errors } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(t('genericSaveError'));
    }
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
    :title="$t('churchRegions.editTitle', { id: id })"
    :back-url="{ name: 'ChurchRegionsList' }"
  >
    <DynamicFormDefault
      ref="formRef"
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