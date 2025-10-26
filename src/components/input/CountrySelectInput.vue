<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import {useCountryStore} from '@/stores/countryStore.ts'
import SelectInput from './SelectInput.vue';

const modelValue = defineModel<any>();

const { t } = useI18n()
const countryStore = useCountryStore()
</script>

<template>
    <SelectInput
      :items="countryStore.asyncOptions"
      v-model="modelValue"
      v-bind="$attrs"
      item-value="id"
      item-title="name"
      :loading="countryStore.loading"
      />
</template>

<style scoped lang="scss">

</style>