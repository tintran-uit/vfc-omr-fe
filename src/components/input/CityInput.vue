<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { useCityStore } from '@/stores/cityStore.ts'

const modelValue = defineModel<any>();

const { t } = useI18n()
const cityStore = useCityStore()
</script>

<template>
    <v-combobox
      :items="cityStore.asyncOptions"
      color="primary"
      variant="outlined"
      hide-details
      density="compact"
      v-model="modelValue"
      :loading="cityStore.loading"
      :clearable="true"
      :menu-props="{ offsetY: true, minWidth: 'auto' }"
    ></v-combobox>
</template>

<style scoped lang="scss">

</style>