<script setup lang="ts">
const modelValue = defineModel();

defineProps({
  name: { type: String, default: "" },
  label: { type: String, default: "" },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  rules: { type: [String, Object, Function], default: "" },
  /** Vuetify: true | "auto" | false */
  hideDetails: { type: [Boolean, String], default: false },
});
</script>

<template>
  <v-text-field
    v-model.number="modelValue"
    type="text"
    :rules="rules"
    :placeholder="placeholder"
    :hide-details="hideDetails"
    single-line
    variant="outlined"
  ></v-text-field>
</template>

<style scoped></style>
