<script setup lang="ts">
import {watch} from 'vue';
import { useField } from 'vee-validate';

// const {rules, name, label} = defineProps(['rules', 'name', 'label']);

// const model = defineModel();
// const attrs = defineOptions({
//   inheritAttrs: false
// });

// console.log('attrs', attrs);

const modelValue = defineModel();

const {name, label, type, placeholder, rules } = defineProps({
  name: {type: String, default: ''},
  label: {type: String, default: ''},
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  rules: { type: [String, Object, Function], default: '' }
});
// const model = defineModel();
// console.log(rules);
const { value, errorMessage, handleChange, handleBlur, meta } = useField('name');

watch(
  () => modelValue,
  (val) => {
    if (val !== value.value) value.value = val;
  },
  { immediate: true }
);

// watch(
//   value,
//   (val) => {
//     if (val !== modelValue) emit('update:modelValue', val);
//   }
// );

</script>

<template>
  <!-- <p>rules: {{ rules }}</p>
  <label for="">{{ label }}</label>
  <input type="text" v-model="value" />
  <p>{{ errorMessage }}</p> -->
  <v-label class="mb-1">{{ label }}</v-label>
  <v-text-field
    type="password"
    v-model="modelValue"
    :rules="rules"
    :placeholder="placeholder"
    single-line
    variant="outlined"
    v-bind="$attrs"
  ></v-text-field>
</template>

<style scoped>

</style>
