<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import {useCurrencyStore} from '@/stores/currencyStore.ts'
import SelectInput from './SelectInput.vue';

const modelValue = defineModel<any>();

const { t } = useI18n()
const currencyStore = useCurrencyStore()
</script>

<template>
    <SelectInput
      :items="currencyStore.asyncOptions"
      v-model="modelValue"
      v-bind="$attrs"
      item-value="id"
      item-title="name"
      :loading="currencyStore.loading"
      />
</template>

<style scoped lang="scss">

</style>