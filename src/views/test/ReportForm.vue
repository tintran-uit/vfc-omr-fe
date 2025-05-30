<script setup lang="ts">
import UiParentCard from "@/components/shared/UiParentCard.vue";
import { ref, watch, computed } from 'vue';
import DynamicForm from "@/components/forms/DynamicForm.vue";
import reportService from '@/services/reportService';
import reportSchemaForm from "@/schema-forms/ReportSchemaForm";

const modelYear = ref(2024);
const modelMonth = ref();
const modelWeeks = ref([]);
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

const getWeeksOfMonth = function(year, month) {
    const weeks = [];
    let startDate = new Date(year, month - 1, 1); // Ngày đầu tiên của tháng

    // Nếu ngày đầu tiên không phải là thứ 2, lùi lại để tìm thứ 2 gần nhất
    while (startDate.getDay() !== 1) {
        startDate.setDate(startDate.getDate() - 1);
    }

    while (startDate.getMonth() <= month - 1) {
        const weekStart = new Date(startDate); // Bắt đầu tuần
        const weekEnd = new Date(startDate);
        weekEnd.setDate(startDate.getDate() + 6); // Kết thúc tuần

        // Tính số thứ tự của tuần trong năm
        const weekNumberOfYear = Math.ceil(
            ((weekStart - new Date(year, 0, 1)) / (24 * 60 * 60 * 1000) + 1) / 7
        );

        // Chỉ thêm tuần nếu có ít nhất 1 ngày nằm trong tháng yêu cầu
        if (weekStart.getMonth() === month - 1 || weekEnd.getMonth() === month - 1) {
            weeks.push({
                weekNumberOfYear,
                weekStart: weekStart.toLocaleDateString(),
                weekEnd: weekEnd.toLocaleDateString(),
            });
        }

        // Chuyển sang tuần kế tiếp
        startDate.setDate(startDate.getDate() + 7);
    }

    return weeks;
}

const getReport = async function(year, weekNumber) {
  const data = await reportService.getReport(year, weekNumber);

  console.log(data);
}

const weeks = computed(() => {
  if (!modelYear.value || !modelMonth.value) {
    return [];
  }

  return getWeeksOfMonth(
    modelYear.value,
    modelMonth.value
  ).map(function (item) {
      return {
        value: item.weekNumberOfYear,
        title: `Week ${item.weekNumberOfYear} (${item.weekStart} - ${item.weekEnd})`
      }
  });
});

const weeklyReportModels = computed(() => {
  if (modelYear.value && modelWeeks.value.length == 0) {
    return [];
  }
  
  return modelWeeks.value.map(function (item) {
    return generateNewWeeklyReport(modelYear, item.value);
  });;
});

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

const generateNewWeeklyReport = function(year, weekNumber) {
    return {
      "church_id": 3,
      "year": year,
      "week_number": weekNumber,
      "worship_sessions": [
          {
              "name": "Sunday Morning Service",
              "day_name": "Sunday",
              "time": "09:00:00",
              "attendance": {
                  "adult_attendance": null,
                  "youth_attendance": null,
                  "child_attendance": null,
                  "number_of_service_for_children": null
              }
          },
      ],
      "cell_groups": {
          "number_of_cell_groups": null,
          "weekly_attendance": null
      },
      "prayer_meetings": {
          "number_of_meetings": null,
          "weekly_attendance": null
      },
      "new_decisions": {
          "weekly_decisions_made": null
      },
      "active_disciples": {
          "being_actively_discipled": null
      },
      "water_baptisms": {
          "weekly_water_baptism": null
      },
      "liw_classes": {
          "number_of_classes": null,
          "total_number_of_students": null
      },
      "leadership_trainings": {
          "number_of_leaders_in_training": null
      },
      "givings": {
          "in_local_currency": null,
          "in_usd": 0
      },
      "mfp_givings": {
          "in_local_currency": null,
          "in_usd": 0
      }
  };
};

const saveWeeklyReport = async function (data) {
  try {
    const response = await reportService.saveReport(3, data);

    alert('Save data successfully');
  } catch (e) {

  }
}
</script>

<template>
  <v-card color="basil" v-if="step==2">
    <v-tabs
      v-model="tab"
      bg-color="transparent"
      grow
    >
      <v-tab
        v-for="(item, index) in modelWeeks"
        :key="item"
        :text="item.title"
        :value="item.value"
      ></v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item
        v-for="(item, index) in modelWeeks"
        :key="index"
        :value="item"
      >
        <v-card
          color="basil"
          flat
        >
          <DynamicForm 
            :schema="reportSchemaForm"
            :data="weeklyReportModels[index]"
            @submit="saveWeeklyReport"
             />
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
              v-model="modelYear"
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
              v-model="modelMonth"
              :return-object="false"
          ></v-combobox>
          <v-label class="mb-1">Week</v-label>
          <v-combobox
              :items="weeks"
              variant="outlined"
              :single-line="false"
              class="mb-3"
              multiple
              chips
              clearable
              item-value="value"
              item-title="title"
              :return-object="true"
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