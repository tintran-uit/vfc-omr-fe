<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { useChurchTypeStore } from '@/stores/churchTypeStore'
import SelectInput from './SelectInput.vue';

const modelValue = defineModel<any>();

const { t } = useI18n()
const churchTypeStore = useChurchTypeStore()
</script>

<template>
    <SelectInput
      :items="churchTypeStore.asyncOptions"
      v-model="modelValue"
      v-bind="$attrs"
      item-value="id"
      item-title="name"
      :loading="churchTypeStore.loading"
      />
</template>

<style scoped lang="scss">

</style>