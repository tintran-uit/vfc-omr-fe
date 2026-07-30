<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { createFormSchema } from '@/form-schemas/addUserFormSchema';
import {userService} from '@/services/userService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { useMessageStore } from '@/stores/messageStore';
import { extractApiError } from '@/utils/formErrors';

const router = useRouter()
const { t } = useI18n();
const messageStore = useMessageStore();
const options = ref({})
const formSchema = createFormSchema();
const formRef = ref();

const loadOptions = async function () {
  options.value = await userService.getFormData();
}

const handleSubmit = async (formData) => {
  try {
    await userService.create(formData)

    router.push({ name: 'UserList' });
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
    <DynamicFormDefault
      ref="formRef"
      :options="options"
      :form-schema="formSchema"
      @submit="handleSubmit"
      :page-title="$t('user.addTitle')"
      :back-url="{ name: 'UserList' }"
    >
    </DynamicFormDefault>
</template>

<style scoped lang="scss">

</style>
