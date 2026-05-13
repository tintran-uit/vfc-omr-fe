<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { createFormSchema } from '@/form-schemas/addChurchPlantingProjectionFormSchema';
import { churchPlantingProjectionService } from '@/services/churchPlantingProjectionService';
import DynamicFormDefault from '@/components/forms/DynamicFormDefault.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const churchId = computed(() => Number(route.params.churchId));
const formSchema = createFormSchema();

const options = ref({
  distanceUnits: [
    { title: 'km', value: 'km' },
    { title: 'miles', value: 'miles' },
  ],
});

const handleSubmit = async (formData: Record<string, any>) => {
  try {
    await churchPlantingProjectionService.create({
      ...formData,
      church_id: churchId.value,
    });
    router.push({ name: 'PlantingProjectionList', params: { churchId: churchId.value } });
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <DynamicFormDefault
    :form-schema="formSchema"
    :options="options"
    :page-title="$t('churchPlantingProjection.addTitle')"
    :back-url="{ name: 'PlantingProjectionList', params: { churchId } }"
    @submit="handleSubmit"
  />
</template>

<style scoped lang="scss">
</style>
