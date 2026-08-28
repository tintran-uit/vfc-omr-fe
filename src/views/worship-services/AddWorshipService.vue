<script setup lang="ts">
import { ref, computed } from 'vue';
import { createFormSchema } from '@/form-schemas/addWorshipServiceFormSchema';
import { worshipServiceService } from '@/services/worshipServiceService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMessageStore } from '@/stores/messageStore';
import { extractApiError } from '@/utils/formErrors';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const messageStore = useMessageStore();
const options = ref({});
const churchId = computed(() => route.params.churchId);
const formSchema = createFormSchema();
const formRef = ref();

const listBackUrl = computed(() => ({
  name: 'WorshipServiceList',
  params: { churchId: churchId.value },
}));

const handleSubmit = async (formData) => {
  try {
    await worshipServiceService.createForChurch(churchId.value, formData);

    router.push(listBackUrl.value);
  } catch (e) {
    const { errors } = extractApiError(e);
    if (Object.keys(errors).length) {
      formRef.value?.setServerErrors(errors);
    } else {
      messageStore.error(t('genericSaveError'));
    }
  }
};
</script>

<template>
  <DynamicFormDefault
    ref="formRef"
    :options="options"
    :form-schema="formSchema"
    :page-title="$t('worshipService.addTitle')"
    :back-url="listBackUrl"
    @submit="handleSubmit"
  />
</template>

<style scoped lang="scss"></style>
