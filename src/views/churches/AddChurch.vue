<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { createFormSchema } from '@/form-schemas/addChurchFormSchema';
import {churchService} from '@/services/churchService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import { useRoute, useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { useMessageStore } from '@/stores/messageStore';
import { extractApiError } from '@/utils/formErrors';

const router = useRouter();
const { t } = useI18n();
const messageStore = useMessageStore();
const formSchema = createFormSchema();
const defaultData = ref({})
const formRef = ref();

async function fetchDefaultData() {
  defaultData.value = await churchService.getDefaultFormData()
}

const handleSubmit = async (formData) => {
  try {
    await churchService.create(formData)

    router.push({ name: 'ChurchList' });
  } catch (e) {
    const { errors } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(t('genericSaveError'));
    }
  }
}

onMounted(() => {
  fetchDefaultData()
})
</script>

<template>
  <DynamicFormDefault
    ref="formRef"
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
