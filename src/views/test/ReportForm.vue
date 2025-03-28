<script setup lang="ts">
import UiParentCard from "@/components/shared/UiParentCard.vue";
import { ref, watch, computed } from 'vue';
import DynamicForm from "@/components/forms/DynamicForm.vue";

const modelWeeks = ref();
const tab = ref();

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

const step = ref();
step.value = 1;

function nextTab(currentTab)
{
  console.log(modelWeeks.value[currentTab + 1]);/*
  if(modelWeeks.value.length - 1 > currentTab) {
    step.value = modelWeeks.value[currentTab + 1];

    console.log('step.value: ', step.value);
  }*/
}

import reportSchemaForm from "@/schema-forms/ReportSchemaForm";
</script>

<template>
  <v-card color="basil" v-if="step==2">
    <v-tabs
      v-model="tab"
      bg-color="transparent"
      grow
    >
      <v-tab
        v-for="item in modelWeeks"
        :key="item"
        :text="item"
        :value="item"
      ></v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item
        v-for="(item, index) in modelWeeks"
        :key="item"
        :value="item"
      >
        <v-card
          color="basil"
          flat
        >
          <DynamicForm :schema="reportSchemaForm" />
          
          <div class="px-5 py-5">
          <v-btn color="primary" block class="mt-4" variant="flat" @click="nextTab(index)">Save</v-btn>
          </div>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>

  
  <div class="overflow-auto" v-if="step==1">
    <v-row class="taskBoardBox ma-0">
      <UiParentCard title="Enter Weekly Report">
        <Form @submit="step = 2">
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
              v-model="modelWeeks"
          ></v-combobox>
          <v-btn color="primary" variant="flat" @click="step=2">Next</v-btn>
        </Form>
      </UiParentCard>
    </v-row>
  </div>
</template>

<style scoped lang="scss">

</style>