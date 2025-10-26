<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/languageStore'
import SelectInput from './SelectInput.vue';

const modelValue = defineModel<any>();

const { t } = useI18n()
const languageStore = useLanguageStore()
</script>

<template>
    <SelectInput
      :items="languageStore.asyncOptions"
      v-model="modelValue"
      v-bind="$attrs"
      item-value="id"
      item-title="name"
      :loading="languageStore.loading"
      />
</template>

<style scoped lang="scss">

</style>