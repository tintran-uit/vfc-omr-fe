<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n'
import {useCountryStore} from '@/stores/countryStore.ts'
import SelectInput from './SelectInput.vue';

const modelValue = defineModel<any>();

const props = withDefaults(
  defineProps<{
    includeAll?: boolean
  }>(),
  { includeAll: false },
)

const { t } = useI18n()
const countryStore = useCountryStore()

const items = computed(() => {
  const options = countryStore.asyncOptions
  if (!props.includeAll) return options
  return [{ id: 0, name: t('generateReport.optionAll') }, ...options]
})

watch(modelValue, (value) => {
  if (!props.includeAll || !Array.isArray(value)) return
  if (!value.includes(0) || value.length <= 1) return
  modelValue.value = value[value.length - 1] === 0 ? [0] : value.filter((id) => id !== 0)
})
</script>

<template>
    <SelectInput
      :items="items"
      v-model="modelValue"
      v-bind="$attrs"
      item-value="id"
      item-title="name"
      :loading="countryStore.loading"
      />
</template>

<style scoped lang="scss">

</style>
