<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { useChurchNetworkStore } from '@/stores/churchNetworkStore'
import SelectInput from './SelectInput.vue';

const modelValue = defineModel<any>();

const { t } = useI18n()
const churchNetworkStore = useChurchNetworkStore()
</script>

<template>
    <SelectInput
      :items="churchNetworkStore.asyncOptions"
      v-model="modelValue"
      v-bind="$attrs"
      item-value="id"
      item-title="name"
      :loading="churchNetworkStore.loading"
      />
</template>

<style scoped lang="scss">

</style>