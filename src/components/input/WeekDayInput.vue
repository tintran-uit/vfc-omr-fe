<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { WEEK_DAYS } from '@/constants/dateTimeConstant';
import SelectInput from './SelectInput.vue';

const modelValue = defineModel<any>();

const { t } = useI18n()

const weekDays = WEEK_DAYS.map(val => ({
  value: val,
  title: t(`weekDays.${val}`)
}))


</script>

<template>
    <SelectInput
      :items="weekDays"
      v-model="modelValue"
      v-bind="$attrs"
      item-value="value"
      item-title="title"
      />
</template>

<style scoped lang="scss">

</style>