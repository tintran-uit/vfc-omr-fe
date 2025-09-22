<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

const modelValue = defineModel<string[]>({ default: [] })

const props = withDefaults(defineProps<{
  label?: string
  placeholder?: string
  min?: number
  max?: number
}>(), {
  label: 'Item',
  placeholder: 'Nhập...',
  min: 1,
  max: undefined
})
watchEffect(() => {
  if (!Array.isArray(modelValue.value)) modelValue.value = []
  while ((props.min ?? 0) > modelValue.value.length) {
    modelValue.value.push('')
  }
})

const canAdd = computed(() =>
  props.max === undefined || modelValue.value.length < props.max!
)

function addItem() {
  if (!canAdd.value) return
  modelValue.value.push('')
}

function removeItem(index: number) {
  if (modelValue.value.length > (props.min ?? 0)) {
    modelValue.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="multi-text-field">
    <div
      v-for="(text, i) in modelValue"
      :key="i"
      class="d-flex align-center gap-2 mb-2"
    >
    <v-text-field
       v-model="modelValue[i]"
        :placeholder="placeholder"
        single-line
        variant="outlined"
      ></v-text-field>
      <v-btn
        icon
        size="small"
        variant="tonal"
        color="error"
        :disabled="modelValue.length <= (min ?? 0)"
        @click="removeItem(i)"
      >
        <v-icon icon="$minus" size="18" />
      </v-btn>
    </div>

    <!-- Add button ở cuối danh sách -->
    <div class="d-flex justify-center mt-2">
    <v-btn
      :disabled="!canAdd"
      @click="addItem"
      icon="$plus"
    >
    </v-btn>
    </div>
  </div>
</template>