<script setup lang="ts">
const modelValue = defineModel<string | number | null>();

const props = defineProps({
  name: { type: String, default: "" },
  label: { type: String, default: "" },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  rules: { type: [String, Object, Function, Array], default: "" },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
</script>

<template>
  <v-text-field
    v-model="modelValue"
    :rules="rules"
    :placeholder="placeholder"
    :readonly="props.readonly"
    :disabled="props.disabled"
    :class="{ 'input-field--readonly': props.readonly }"
    single-line
    variant="outlined"
    v-bind="$attrs"
  ></v-text-field>
</template>

<style scoped></style>
