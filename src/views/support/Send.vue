<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { createFormSchema } from '@/form-schemas/addUserFormSchema';
import {userService} from '@/services/userService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/messageStore';

const router = useRouter()
const options = ref({})
const formSchema = createFormSchema();

const loadOptions = async function () {
  options.value = await userService.getFormData();
}

const handleSubmit = async (formData) => {
  try {
    await userService.create(formData)

    router.push({ name: 'UserList' });
  } catch (e) {
    console.log('error', e);
  }
}

onMounted(() => {
  loadOptions();
});
</script>

<template>
    <DynamicFormDefault
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