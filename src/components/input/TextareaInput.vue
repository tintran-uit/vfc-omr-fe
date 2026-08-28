<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const modelValue = defineModel<string | number | null>();

const props = withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    rules?: (string | ((v: unknown) => boolean | string))[];
    readonly?: boolean;
    disabled?: boolean;
    hideDetails?: boolean | "auto";
    rows?: number | string;
    autoGrow?: boolean;
    maxRows?: number | string;
    noResize?: boolean;
  }>(),
  {
    rules: () => [],
    readonly: false,
    disabled: false,
    hideDetails: true,
    rows: 4,
    autoGrow: false,
    noResize: false,
  },
);

const translatedLabel = computed(() => (props.label ? t(props.label) : ""));
const translatedPlaceholder = computed(() =>
  props.placeholder ? t(props.placeholder) : "",
);
</script>

<template>
  <v-textarea
    v-model="modelValue"
    :placeholder="translatedPlaceholder"
    :label="translatedLabel"
    :rules="props.rules"
    :readonly="props.readonly"
    :disabled="props.disabled"
    :hide-details="props.hideDetails"
    :rows="props.rows"
    :auto-grow="props.autoGrow"
    :max-rows="props.maxRows"
    :no-resize="props.noResize"
    color="primary"
    variant="outlined"
    density="compact"
    v-bind="$attrs"
  />
</template>

<style scoped lang="scss"></style>
