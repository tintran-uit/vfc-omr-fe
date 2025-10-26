<script setup lang="ts">
import {ref, watch, computed, onMounted, defineAsyncComponent} from 'vue'
import CardHeader from '../shared/CardHeader.vue';
import AttendanceLineChart from '../charts/AttendanceLineChart.vue';
import JITChart from '../charts/JITChart.vue';
import GivingChart from '../charts/GivingChart.vue';
import { graphService } from '@/services/graphService';

const ProfileTab = defineAsyncComponent(() => import('../charts/AttendanceLineChart.vue'))
const SettingsTab = defineAsyncComponent(() => import('../charts/AttendanceLineChart.vue'))
const ActivityTab = defineAsyncComponent(() => import('../charts/AttendanceLineChart.vue'))

import AttendanceChart from '@/components/charts/AttendanceChart.vue'



const periodOptions = [
  {
    value: "12m",
    title: "12 months"
  },
  {
    value: "24m",
    title: "24 months"
  }
]
const periodModel = ref('12m')

const onChangePeriod = (val) => {
  console.log('change period to: ', val)
}

const tab = ref('profile')


const props = withDefaults(
  defineProps<{
    churchId: number
  }>(),
  {
    churchId: 76
  }
)

const emit = defineEmits<{
  
}>()

const formatAttendanceData = (weekKeys, attendanceValues, cellGroupValues, prayerMeetingValues, liwClassValues) => {
  return weekKeys.map(({Year, Week}, index) => {
    return {
      week: Week,
      year: Year,
      attendance: attendanceValues[index],
      cellGroup: cellGroupValues[index],
      prayerMeeting: prayerMeetingValues[index],
      liwClass: liwClassValues[index] 
    }
  });
}
 // 'giving_in_usd',
  // 'giving_in_local_currency',
  // 'mfp_giving_in_local_currency',
  // 'mfp_giving_in_usd',
const formatGiving = (weekKeys, givingUsd, givingLocalCurrency, mfpUsd, mfpLocalCurrency) => {
  return weekKeys.map(({Year, Week}, index) => {
    return {
      week: Week,
      year: Year,
      givingUsd: givingUsd[index],
      mdpUsd: mfpUsd[index]
    }
  });
}

const formatVisitData = (weekKeys, visitSummary) => {
  return weekKeys.map(({Year, Week}, index) => {
    return {
      week: Week,
      year: Year,
      visit: visitSummary[index],
    }
  });
}

const sampleData = [
  { week: 'Jan', year: 2024, attendance: 120, cellGroup: 80, prayerMeeting: 45, liwClass: 30 },
  { week: 'Feb', year: 2024, attendance: 130, cellGroup: 85, prayerMeeting: 50, liwClass: 28 },
  { week: 'Mar', year: 2024, attendance: 125, cellGroup: 90, prayerMeeting: 55, liwClass: 35 },
  { week: 'Apr', year: 2024, attendance: 140, cellGroup: 95, prayerMeeting: 52, liwClass: 38 },
  { week: 'May', year: 2024, attendance: 150, cellGroup: 100, prayerMeeting: 60, liwClass: null },
  { week: 'Jun', year: 2024, attendance: 160, cellGroup: 110, prayerMeeting: 62, liwClass: null },
  { week: 'Jul', year: 2024, attendance: 155, cellGroup: 108, prayerMeeting: 58, liwClass: 41 },
  { week: 'Aug', year: 2024, attendance: 165, cellGroup: 112, prayerMeeting: 63, liwClass: 45 },
  { week: 'Sep', year: 2024, attendance: 170, cellGroup: 115, prayerMeeting: 66, liwClass: 47 },
  { week: 'Oct', year: 2024, attendance: 175, cellGroup: 118, prayerMeeting: 70, liwClass: null },
  { week: 'Nov', year: 2024, attendance: 180, cellGroup: 120, prayerMeeting: 72, liwClass: 50 },
  { week: 'Dec', year: 2024, attendance: 190, cellGroup: 125, prayerMeeting: 75, liwClass: 52 },
]

const apiData = ref(null);
const attendanceChartData = computed(() => {
  if (apiData.value == null) {
    return [];
  }

  const { week_keys: weekKeys, dates, data} = apiData.value;

  const listChartDataByChurch = []
  data.forEach(church => {
    const chartDataByChurch = {};

    chartDataByChurch.church_id = church.church_id;
    chartDataByChurch.church_name = church.church_name;
    
    chartDataByChurch.attendanceData = formatAttendanceData(
      weekKeys,
      church.attendance_values,
      church.cell_group_values,
      church.prayer_meeting_values,
      church.liw_class_values
    );

    chartDataByChurch.givingData = giving(
      weekKeys,
      church.giving_in_local_currency,
      church.giving_in_usd,
      church.mfp_giving_in_local_currency,
      church.mfp_giving_in_usd
    );

    chartDataByChurch.visit = 

    listChartDataByChurch.push(chartDataByChurch)
  });
  
  return listChartDataByChurch
})

onMounted(async () => {
  apiData.value = await graphService.getDataAttendanceGivingPastoralVisit(props.churchId);
  
  // 'attendance_values',
  // 'cell_group_values',
  // 'prayer_meeting_values',
  // 'liw_class_values',

  // 'giving_in_usd',
  // 'giving_in_local_currency',
  // 'mfp_giving_in_local_currency',
  // 'mfp_giving_in_usd',

  // 'visit_summary'
})

</script>

<template>
  <!-- <pre>
    {{ attendanceChartData }}
  </pre> -->
  <AttendanceChart
    :chart-data="sampleData"
    />

   <CardHeader title="Attendance Graph">

    <!-- Tabs -->
    <v-tabs v-model="tab" color="primary">
      <template v-for="chartData in attendanceChartData" :key="chartData.church_id">
        <v-tab :value="`chart-${chartData.church_id}`">{{ chartData.church_name }}</v-tab>
      </template>
    </v-tabs>

    <v-divider></v-divider>

    <v-window v-model="tab">
      <template v-for="chartData in attendanceChartData" :key="chartData.church_id">
        <v-window-item :value="`chart-${chartData.church_id}`">
        <v-lazy :options="{ threshold: 0.1 }">
          <template #default>
            <AttendanceChart
              :chart-data="chartData.data"
              />
          </template>
        </v-lazy>
      </v-window-item>
      </template>
    </v-window>
    

    <!-- 👇 Đây là slot header (tùy chọn) -->
    <template #header>
      <div class="d-flex align-center justify-end" style="min-width: 180px;">
        <SelectInput
          v-model="periodModel"
          :items="periodOptions"
          @change="onChangePeriod"
          density="compact"
          hide-details
          style="max-width: 160px;"
        />
      </div>
    </template>
   </CardHeader>
</template>

<style scoped>

</style>
