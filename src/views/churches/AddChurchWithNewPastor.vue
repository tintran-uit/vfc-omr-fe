<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import {createFormSchema as createAddChurchFormSchema} from '@/form-schemas/addChurchFormSchema';
import {createFormSchema as createAddUserFormSchema} from '@/form-schemas/addUserFormSchema';
import DynamicFormMultiple from '@/components/forms/DynamicFormMultiple.vue';
import { useRoute, useRouter } from "vue-router";
import {churchService} from '@/services/churchService';
import { userService } from '@/services/userService';
import { useI18n } from 'vue-i18n';
import { useMessageStore } from '@/stores/messageStore';
import { extractApiError } from '@/utils/formErrors';

const options = ref({});
const router = useRouter();
const { t } = useI18n();
const messageStore = useMessageStore();
const formRef = ref();
const churchSchema = createAddChurchFormSchema();
churchSchema.fields = churchSchema.fields.filter(f => f.name !== 'pastor_id')

const multipleSchema = {
  user: createAddUserFormSchema(),
  church: churchSchema,
}

const loadOptions = async function () {
  options.value = await userService.getFormData();
}

const handleSubmit = async (formData) => {
  try {
    await churchService.createWithNewPastor(formData)

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
  loadOptions();
});
</script>

<template>
    <DynamicFormMultiple
      ref="formRef"
      :options="options"
      :form-schema="multipleSchema"
      :is-multi-part="true"
      :page-title="$t('church.addWithNewUserTitle')"
      :back-url="{ name: 'ChurchList' }"
      @submit="handleSubmit"
    />
      
</template>

<style scoped lang="scss">

</style>
