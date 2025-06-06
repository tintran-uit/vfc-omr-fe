<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import { computed } from 'vue'

const modelValue = defineModel<any>();

defineProps<{
  items: any[]
  label?: string
  placeholder?: string
  itemTitle?: string | ((item: any) => string)
  itemValue?: string
  returnObject?: boolean
  noDataText?: string
}>()

const translatedLabel = computed(() => label ? t(label) : '')
const translatedPlaceholder = computed(() => placeholder ? t(placeholder) : '')
const translatedNoDataText = computed(() => noDataText ? t(noDataText) : t('common.no_data'))
</script>

<template>
    <v-label class="text-wrap">{{label}}</v-label>

    <v-select
      :items="items"
      role="link"
      color="primary"
      variant="outlined"
      hide-details
      density="compact"
      v-model="modelValue"
    ></v-select>
</template>

<style scoped lang="scss">

</style>