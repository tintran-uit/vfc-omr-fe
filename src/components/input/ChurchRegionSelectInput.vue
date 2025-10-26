<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { useChurchRegionStore } from '@/stores/churchRegionStore'
import SelectInput from './SelectInput.vue';

const modelValue = defineModel<any>();

const { t } = useI18n()
const churchRegionStore = useChurchRegionStore()
</script>

<template>
    <SelectInput
      :items="churchRegionStore.asyncOptions"
      v-model="modelValue"
      v-bind="$attrs"
      item-value="id"
      item-title="name"
      :loading="churchRegionStore.loading"
      />
</template>

<style scoped lang="scss">

</style>