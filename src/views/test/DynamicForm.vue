<script setup lang="ts">
import UiParentCard from "@/components/shared/UiParentCard.vue";
import DynamicForm from "@/components/forms/DynamicForm.vue";
import { ref, watch, computed } from 'vue';



import schemaForm from "@/form-schemas/reportFormSchema";

function initTab() {
  tab.value = modelWeeks[0];
}

const years = ref([2024, 2023, 2022, 2021, 2020]);
const months = ref([
  {
    value: 1,
    name:  'January'
  },
  {
    value: 2,
    name:  'February'
  },
  {
    value: 3,
    name:  'March'
  },
  {
    value: 4,
    name:  'April'
  },
  {
    value: 5,
    name:  'May'
  },
  {
    value: 6,
    name:  'June'
  },
  {
    value: 7,
    name:  'July'
  },
  {
    value: 8,
    name:  'August'
  },
  {
    value: 9,
    name:  'October'
  },
  {
    value: 10,
    name:  'September'
  },
  {
    value: 11,
    name:  'November'
  },
  {
    value: 12,
    name:  'December'
  },
]);

// const weeks = computed(() => {
//
// });
</script>

<template>
  <DynamicForm :schema="schemaForm" />
</template>

<style scoped lang="scss">

</style>