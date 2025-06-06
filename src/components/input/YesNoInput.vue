<script setup lang="ts">
import {useDeepModel} from '@/utils/objectUtil.js';
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
    <!-- <v-label class="text-wrap">{{field.label}}</v-label> -->
    
    <SelectInput
      :items="items"
      v-model="modelValue"
    />
</template>

<style scoped lang="scss">

</style>