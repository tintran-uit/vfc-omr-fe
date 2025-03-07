<script setup lang="ts">
import UiParentCard from "@/components/shared/UiParentCard.vue";
import { ref, watch, computed } from 'vue';

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

import reportSchemaForm from "@/schema-forms/ReportSchemaForm";
</script>

<template>
  <v-row class="page-breadcrumb mb-0 mt-n2">
    <v-col cols="12" md="12">
      <v-card elevation="0" variant="text">
        <v-row no-gutters class="align-center">
          <v-col sm="12">
            <h3 class="text-h3 mt-1 mb-0">Weekly Report</h3>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
  <div class="overflow-auto">
    <v-row class="taskBoardBox ma-0">
      <UiParentCard title="On Type">
        <Form>
          <v-label class="mb-1">Year</v-label>
          <v-combobox
              :items="years"
              variant="outlined"
              placeholder="Year"
              single-line
              class="mb-3"
          ></v-combobox>

          <v-label class="mb-1">Month</v-label>
          <v-combobox
              :items="months"
              variant="outlined"
              placeholder="Month"
              single-line
              class="mb-3"
              item-title="name"
              item-value="value"
          ></v-combobox>
          <v-label class="mb-1">Week</v-label>
          <v-combobox
              :items="['Week 1', 'Week 2', 'Week 3', 'Week 4']"
              variant="outlined"
              placeholder="Month"
              single-line
              class="mb-3"
              multiple
              chips
              clearable
          ></v-combobox>
          <v-btn color="primary" variant="flat" type="submit">Submit</v-btn>
        </Form>
      </UiParentCard>
    </v-row>
  </div>
</template>

<style scoped lang="scss">

</style>