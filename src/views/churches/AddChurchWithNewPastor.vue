<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import {createFormSchema as createAddChurchFormSchema} from '@/form-schemas/addChurchFormSchema';
import { createFormSchema as createAddUserFormSchema} from '@/form-schemas/addUserFormSchema';
import DynamicFormMultiple from '@/components/forms/DynamicFormMultiple.vue';
import { useRoute, useRouter } from "vue-router";
import {churchService} from '@/services/churchService';
import { userService } from '@/services/userService';

const options = ref({});
const router = useRouter();
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
    console.log('error', e);
  }
}

onMounted(() => {
  loadOptions();
});
</script>

<template>
    <DynamicFormMultiple
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