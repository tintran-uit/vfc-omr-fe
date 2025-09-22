<script setup lang="ts">
import {watch} from 'vue';

const modelValue = defineModel();

const {name, label, type, placeholder, rules } = defineProps({
  name: {type: String, default: ''},
  label: {type: String, default: ''},
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  rules: { type: [String, Object, Function], default: '' },
})
</script>

<template>
  <v-text-field
    v-model="modelValue"
    :rules="rules"
    :placeholder="placeholder"
    single-line
    variant="outlined"
  ></v-text-field>
</template>

<style scoped>

</style>
