<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SelectInput from '@/components/input/SelectInput.vue';
const { t } = useI18n()

const modelValue = defineModel();

// const props = defineProps({
//   form: Object,
//   field: Object,
// });

const items = ref([
  {
    value: true,
    title: t('Yes')
  },
  {
    value: false,
    title: t('No')
  }
]);
</script>

<template>
    <SelectInput
      :items="items"
      v-model="modelValue"
    />
</template>

<style scoped lang="scss">

</style>