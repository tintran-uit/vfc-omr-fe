<script setup lang="ts">
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
    /** Show label on outlined field instead of separate v-label above */
    labelOnField?: boolean
  }>(),
  {
    rules: () => [],
    labelOnField: false,
  }
)

const emit = defineEmits<{
  (e: 'change', value: any): void
}>()

const resolvedLabel = computed(() => (props.label ? t(props.label) : undefined))
</script>

<template>
    <v-label v-if="label && !labelOnField" class="text-wrap">{{ resolvedLabel }}</v-label>

    <v-autocomplete
      :items="items"
      color="primary"
      variant="outlined"
      density="compact"
      :rules="rules"
      :label="labelOnField ? resolvedLabel : undefined"
      :item-title="itemTitle"
      :item-value="itemValue"
      v-model="modelValue"
      :clearable="true"
      location="bottom"
      position-strategy="connected"
      scroll-strategy="close"
      @update:modelValue="emit('change', $event)"
      v-bind="$attrs"
    />
</template>

<style scoped lang="scss">

</style>