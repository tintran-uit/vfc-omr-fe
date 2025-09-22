<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGeographicalRegionStore } from '@/stores/geographicalRegionStore'
import SelectInput from './SelectInput.vue'

const modelValue = defineModel<any>();

const { t } = useI18n()
const geographicalRegionStore = useGeographicalRegionStore()
</script>

<template>
    <SelectInput
      :items="geographicalRegionStore.asyncOptions"
      v-model="modelValue"
      v-bind="$attrs"
      item-value="id"
      item-title="name"
      :loading="geographicalRegionStore.loading"
      />
</template>

<style scoped lang="scss">

</style>