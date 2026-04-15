<script setup lang="ts">
import { watch } from "vue";

const modelValue = defineModel();

const props = defineProps({
  name: { type: String, default: "" },
  label: { type: String, default: "" },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  rules: { type: [String, Object, Function], default: "" },
});

const onInput = (e) => {
  const val = e.target.value;

  // chỉ giữ lại số
  const cleaned = val.replace(/\D/g, "");

  modelValue.value = cleaned;
};
</script>

<template>
  <v-text-field
    v-model.number="modelValue"
    type="text"
    :rules="rules"
    :placeholder="placeholder"
    single-line
    variant="outlined"
  ></v-text-field>
</template>

<style scoped></style>
