<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import { computed } from 'vue'

const modelValue = defineModel<any>();

const props = withDefaults(
  defineProps<{
    items: any[]
    label?: string
    placeholder?: string
    itemTitle?: string | ((item: any) => string)
    itemValue?: string | ((item: any) => any)
    returnObject?: boolean
    noDataText?: string
    rules?: (string | ((v: any) => boolean | string))[]
  }>(),
  {
    rules: () => [],
  }
)

const emit = defineEmits<{
  (e: 'change', value: any): void
}>()

const translatedLabel = computed(() => label ? t(label) : '')
const translatedPlaceholder = computed(() => placeholder ? t(placeholder) : '')
const translatedNoDataText = computed(() => noDataText ? t(noDataText) : t('noData'))
</script>

<template>
    <v-label class="text-wrap">{{label}}</v-label>

    <v-autocomplete
      :items="items"
      color="primary"
      variant="outlined"
      density="compact"
      :rules="rules"
      :item-title="itemTitle"
      :item-value="itemValue"
      v-model="modelValue"
      :clearable="true"
      location="bottom"
      position-strategy="connected"
      scroll-strategy="close"
      @update:modelValue="emit('change', $event)"
      v-bind="$attrs"

    ></v-autocomplete>
</template>

<style scoped lang="scss">

</style>