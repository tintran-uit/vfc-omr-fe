<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import { computed } from 'vue'
import SelectInput from './SelectInput.vue';
import { churchDataFormStore } from '@/stores/churchDataFormStore';

const modelValue = defineModel<any>();

defineProps<{
  label?: string
}>()


const items = churchDataFormStore().networks;

</script>

<template>
    <v-label class="text-wrap">{{label}}</v-label>

    <SelectInput
      :items="items"
      v-model="modelValue"
      />
</template>

<style scoped lang="scss">

</style>