<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { useServiceVenueStore } from '@/stores/serviceVenueStore'
import SelectInput from './SelectInput.vue';

const modelValue = defineModel<any>();

const { t } = useI18n()
const serviceVenueStore = useServiceVenueStore()
</script>

<template>
    <SelectInput
      :items="serviceVenueStore.asyncOptions"
      v-model="modelValue"
      v-bind="$attrs"
      item-value="id"
      item-title="name"
      :loading="serviceVenueStore.loading"
      />
</template>

<style scoped lang="scss">

</style>