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

apiData.value = await graphService.getDataAttendanceGivingPastoralVisit(props.churchId);

</script>

<template>
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
