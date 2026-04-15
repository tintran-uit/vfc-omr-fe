<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { getWeeksOfMonth, formatDate } from "@/helpers/dateTimeHelper";
import { createFormSchema } from "@/form-schemas/addMonthlyDataFormSchema";
import DynamicFormDefault from "@/components/forms/DynamicFormDefault.vue";
import { useRoute, useRouter } from "vue-router";
import { monthlyDataService } from "@/services/monthlyDataService";
import { worshipServiceService } from "@/services/worshipServiceService";
import WeeklyDataForm from "@/components/weekly-data/WeeklyDataForm.vue";
import CardHeader from "@/components/shared/CardHeader.vue";

const route = useRoute();
const router = useRouter();
const formSchema = createFormSchema();
const defaultData = ref({});
const options = ref({
  services: [],
});
const currentStep = ref(1);
const currentTab = ref<number | null>(null);

const modelYear = ref(null);
const modelMonth = ref(null);
const modelWeeks = ref([]);

const id = computed(() => Number(route.params.id));
const weekReportStatuses = ref({});
const mapWeekReportStatuses = computed(() => {
  if (Object.keys(weekReportStatuses.value).length === 0) {
    return {};
  }

  const map = {};
  weekReportStatuses.value?.weeks?.forEach((w) => {
    map[w.week_number] = w.is_reported;
  });

  return map;
});

const currentYear = new Date().getFullYear();
const listYear = [];
for (let i = currentYear; i >= 1990; i--) {
  listYear.push(i);
}

const baseMonth = [
  { value: 1, name: "January" },
  { value: 2, name: "February" },
  { value: 3, name: "March" },
  { value: 4, name: "April" },
  { value: 5, name: "May" },
  { value: 6, name: "June" },
  { value: 7, name: "July" },
  { value: 8, name: "August" },
  { value: 9, name: "September" },
  { value: 10, name: "October" },
  { value: 11, name: "November" },
  { value: 12, name: "December" },
];

const currentMonth = new Date().getMonth() + 1;
const listMonth = computed(() => {
  return baseMonth.map((m) => ({
    ...m,
    props: {
      disabled: modelYear.value === currentYear && m.value > currentMonth,
    },
  }));
});

const today = new Date();
const listWeeks = computed(() => {
  if (!modelMonth.value || !modelYear.value) {
    return [];
  }

  return getWeeksOfMonth(modelYear.value, modelMonth.value)
    .filter((week) => {
      const endDate = new Date(week.endDate);

      // nếu là hiện tại → chỉ lấy tuần đã qua
      if (modelYear.value === today.getFullYear() && modelMonth.value === today.getMonth() + 1) {
        return endDate <= today;
      }

      return true;
    })
    .map((week) => {
      const startDateStr = formatDate(week.startDate, "DD MMM ’YY");
      const endDateStr = formatDate(week.endDate, "DD MMM ’YY");

      return {
        value: week.weekNumber,
        title: `Week ${week.weekNumber} (${startDateStr} - ${endDateStr})`,
      };
    });
});

const weekMap = computed(() => new Map(listWeeks.value.map((w) => [w.value, w])));

const selectedWeeks = computed(() =>
  modelWeeks.value.map((val) => weekMap.value.get(val)).filter(Boolean),
);

const committedWeeks = ref([]);

const getTabClass = (item) => {
  return {
    "tab-active": currentTab.value === item.value,
    "tab-special": [],
  };
};

const onBack = () => {
  const index = committedWeeks.value.findIndex((w) => w.value === currentTab.value);

  if (index > 0) {
    currentTab.value = committedWeeks.value[index - 1].value;
    return;
  }

  currentStep.value = 1;
  currentTab.value = null;
  committedWeeks.value = [];
};

const goToStep2 = () => {
  // 👇 chốt dữ liệu tại thời điểm click
  committedWeeks.value = selectedWeeks.value;

  currentStep.value = 2;

  if (committedWeeks.value.length > 0) {
    currentTab.value = committedWeeks.value[0].value;
  }
};

const onNext = () => {
  const index = committedWeeks.value.findIndex((w) => w.value === currentTab.value);

  if (index < committedWeeks.value.length - 1) {
    currentTab.value = committedWeeks.value[index + 1].value;
    return;
  }

  router.push({ name: "ChurchDetail", params: { id: id.value } });
};

const handleSubmit = async (formData) => {
  try {
    await worshipServiceService.getListByChurch();

    // router.push({ name: 'ChurchList' });
  } catch (e) {
    console.log("error", e);
  }
};

const fetchWorshipServices = async () => {
  try {
    options.value.services = await worshipServiceService.getListByChurch(id.value);
  } catch (e) {
    console.log("error", e);
  }
};

const fetchWeekReportStatuses = async () => {
  try {
    weekReportStatuses.value = await monthlyDataService.getWeekReportStatuses(
      id.value,
      modelYear.value,
      modelMonth.value,
    );
  } catch (e) {
    console.log("error", e);
  }
};

onMounted(() => {
  fetchWorshipServices();
  modelYear.value = currentYear;
});

watch(modelYear, () => {
  if (modelMonth.value && modelYear.value === currentYear) {
    if (modelMonth.value > currentMonth) {
      modelMonth.value = null;
    }
  }
});

watch(
  () => [modelYear.value, modelMonth.value],
  () => {
    if (modelYear.value && modelMonth.value) {
      fetchWeekReportStatuses();
    } else {
      weekReportStatuses.value = {};
    }
  },
);
</script>

<template>
  <v-row class="mb-2 mt-2">
    <!-- title -->
    <v-col
      cols="12"
      class="d-flex align-center"
    >
      <div class="text-h4 font-weight-medium">
        Data for: Victory Family Centre - Ho Chi Minh City, Vietnam
      </div>
    </v-col>
  </v-row>

  <CardHeader
    v-if="currentStep === 1"
    title="Select Month and Year"
  >
    <div class="overflow-auto pa-5">
      <v-row
        class="ma-0"
        justify="center"
      >
        <v-col
          cols="12"
          md="6"
          lg="5"
        >
          <v-form>
            <v-label class="mb-1">Year</v-label>
            <v-combobox
              :items="listYear"
              variant="outlined"
              placeholder="Year"
              single-line
              class="mb-3"
              v-model="modelYear"
            ></v-combobox>

            <v-label class="mb-1">Month</v-label>
            <v-combobox
              :items="listMonth"
              variant="outlined"
              placeholder="Month"
              single-line
              class="mb-3"
              item-title="name"
              item-value="value"
              v-model="modelMonth"
              :return-object="false"
              :item-props="(item) => item.props"
            ></v-combobox>

            <div v-if="listWeeks.length">
              <v-label class="mb-1">Week</v-label>
              <v-checkbox
                v-for="week in listWeeks"
                :key="week.value"
                v-model="modelWeeks"
                :value="week.value"
                hide-details
              >
                <!-- label custom -->
                <template #label>
                  <div class="d-flex justify-space-between w-100">
                    <span>{{ week.title }}</span>

                    <v-icon
                      v-if="mapWeekReportStatuses[week.value]"
                      icon="$checkCircleOutline"
                      color="success"
                      class="ml-2"
                    />
                  </div>
                </template>
              </v-checkbox>
            </div>

            <div class="d-flex justify-center mt-4">
              <v-btn
                color="primary"
                variant="flat"
                :disabled="modelWeeks.length === 0"
                @click="goToStep2"
              >
                Next
              </v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </div>
  </CardHeader>

  <!-- Step 2 -->
  <div v-if="currentStep === 2">
    <v-tabs
      v-model="currentTab"
      class="monthly-tabs mt-4"
      hide-slider
    >
      <v-tab
        v-for="week in committedWeeks"
        :key="week.value"
        :value="week.value"
        :class="getTabClass(week)"
      >
        {{ week.title }}
      </v-tab>
    </v-tabs>

    <v-window v-model="currentTab">
      <v-window-item
        v-for="week in committedWeeks"
        :key="week.value"
        :value="week.value"
      >
        <transition
          name="fade"
          mode="out-in"
        >
          <div :key="week.value">
            <WeeklyDataForm
              :church-id="id"
              :week-number="week.value"
              :year="modelYear"
              @back="onBack"
              @next="onNext"
              :has-report-data="mapWeekReportStatuses[week.value]"
            />
          </div>
        </transition>
      </v-window-item>
    </v-window>
  </div>
  <!-- #step2 -->
</template>

<style scoped lang="scss"></style>
