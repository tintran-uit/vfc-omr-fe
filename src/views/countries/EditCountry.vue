<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { createFormSchema } from '@/form-schemas/addCountryFormSchema';
import { countryService } from '@/services/countryService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import FormPageShell from "@/components/shared/FormPageShell.vue";
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { useMessageStore } from '@/stores/messageStore';
import { extractApiError } from '@/utils/formErrors';

const router = useRouter()
const route = useRoute()
const { t } = useI18n();
const messageStore = useMessageStore();
const id = computed(() => route.params.id);
const formSchema = createFormSchema();
const editData = ref(null);
const formRef = ref();

const fetchEditData = async function (id) {
  if (!id) return;
  try {
    const data = await countryService.getById(id);
    
    editData.value = data;
  } catch (e) {
    console.log('error', e);
  }
}

const handleSubmit = async (formData) => {
  try {
    await countryService.update(id.value, formData)

    router.push({ name: 'CountryList' });
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
    :title="$t('country.editTitle', { id: id })"
    :back-url="{ name: 'CountryList' }"
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
