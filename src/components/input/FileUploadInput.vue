<script setup lang="ts">
import { ref, watch } from 'vue'

/* =====================
 Props
===================== */
const props = defineProps({
  modelValue: {
    type: [File, Array],
    default: null,
  },
  label: {
    type: String,
    default: 'Upload file',
  },
  accept: {
    type: String,
    default: '*/*',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  showSize: {
    type: Boolean,
    default: true,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
})

/* =====================
 Emits
===================== */
const emit = defineEmits<{
  (e: 'update:modelValue', value: File | File[] | null): void
}>()

/* =====================
 State
===================== */
const internalValue = ref<File | File[] | null>(props.modelValue)

/* =====================
 Sync v-model
===================== */
watch(
  () => props.modelValue,
  val => {
    internalValue.value = val
  }
)

function updateValue(val: File | File[] | null) {
  emit('update:modelValue', val)
}
</script>
<template>
  <v-file-input
    v-model="internalValue"
    :accept="accept"
    :multiple="multiple"
    :show-size="showSize"
    :clearable="clearable"
    variant="outlined"
    density="compact"
    @update:modelValue="updateValue"
  />
</template>