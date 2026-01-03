<script setup lang="ts">
import { ref, watch, computed, onMounted, defineAsyncComponent } from 'vue'
import CardHeader from '../shared/CardHeader.vue';
import { graphService } from '@/services/graphService';
import AttendanceChart from '@/components/charts/AttendanceChart.vue'
import GivingChart from '@/components/charts/GivingChart.vue';
import VisitChart from '@/components/charts/VisitChart.vue';
import { PERIOD_12_MONTHS, PERIOD_24_MONTHS } from '@/constants/graphConstant';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const props = withDefaults(
  defineProps<{
    churchId: number
  }>(),
  {}
)
const periodOptions = [
  {
    value: PERIOD_12_MONTHS,
    title: t('last12Months')
  },
  {
    value: PERIOD_24_MONTHS,
    title: t('last24Months')
  }
]
const periodModel = ref(PERIOD_12_MONTHS)
const tab = ref(null)

const titleAttendance = computed(() => {
  return t('chart.attendanceLastNumberMonth', { number: periodModel.value === PERIOD_12_MONTHS ? 12 : 24 })
})
const titleGiving = computed(() => {
  return t('chart.givingLastNumberMonth', { number: periodModel.value === PERIOD_12_MONTHS ? 12 : 24 })
})
const titleVisit = computed(() => {
  return t('chart.visitLastNumberMonth', { number: periodModel.value === PERIOD_12_MONTHS ? 12 : 24 })
})

const formatAttendanceData = (weekKeys, attendanceValues, cellGroupValues, prayerMeetingValues, liwClassValues, labels) => {
  return weekKeys.map(({ year, week }, index) => {
    return {
      week: week,
      year: year,
      label: labels[index],
      attendance: attendanceValues[index],
      cellGroup: cellGroupValues[index],
      prayerMeeting: prayerMeetingValues[index],
      liwClass: liwClassValues[index]
    }
  });
}

const formatGiving = (weekKeys, givingUsdValues, givingLocalCurrencyValues, mfpUsdValues, mfpLocalCurrencyValues, labels) => {
  return weekKeys.map(({ year, week }, index) => {
    return {
      week: week,
      year: year,
      label: labels[index],
      givingUsd: givingUsdValues[index],
      givingLocalCurrency: givingLocalCurrencyValues[index],
      mfpUsd: mfpUsdValues[index],
      mfpLocalCurrency: mfpLocalCurrencyValues[index],
    }
  });
}

const formatVisitData = (weekKeys, visitSummary, labels) => {
  return weekKeys.map(({ year, week }, index) => {
    return {
      week: week,
      year: year,
      label: labels[index],
      visits: visitSummary[index],
    }
  });
}

const apiData = ref(null);
const listChartDataByChurch = computed(() => {
  if (apiData.value == null) {
    return [];
  }

  const { week_keys: weekKeys, dates, data } = apiData.value;

  const list = []

  data.forEach(church => {
    const chartDataByChurch = {};

    chartDataByChurch.church_id = church.church_id;
    chartDataByChurch.church_name = church.church_name;

    chartDataByChurch.attendanceData = formatAttendanceData(
      weekKeys,
      church.attendance_values,
      church.cell_group_values,
      church.prayer_meeting_values,
      church.liw_class_values,
      dates
    );

    chartDataByChurch.givingData = formatGiving(
      weekKeys,
      church.giving_in_usd,
      church.giving_in_local_currency,
      church.mfp_giving_in_usd,
      church.mfp_giving_in_local_currency,
      dates
    );

    chartDataByChurch.visitData = formatVisitData(
      weekKeys,
      church.visit_summary,
      dates
    );

    list.push(chartDataByChurch)
  });

  return list
})

const onChangePeriod = async (period) => {
  apiData.value = await graphService.getDataAttendanceGivingPastoralVisit(
    props.churchId,
    period,
    false
  );
}

const fetchData = async () => {
  apiData.value = await graphService.getDataAttendanceGivingPastoralVisit(
    props.churchId,
    PERIOD_12_MONTHS,
    false
  );
}

watch(
  () => props.churchId,
  async (val) => {
    if (val) {
      fetchData()
    }
  },
  { immediate: true }
)

watch(listChartDataByChurch, (newVal) => {
  if (newVal.length > 0 && !tab.value) {
    tab.value = `chart-${newVal[0].church_id}`
  }
},
  { immediate: true })

</script>

<template>

  <CardHeader :title="$t('chart.attendanceGraph')">
    <!-- Tabs -->
    <v-tabs v-model="tab" color="primary">
      <template v-for="chartDataByChurch in listChartDataByChurch" :key="chartDataByChurch.church_id">
        <v-tab :value="`chart-${chartDataByChurch.church_id}`">{{ chartDataByChurch.church_name }}</v-tab>
      </template>
    </v-tabs>

    <v-divider></v-divider>

    <v-window v-model="tab">
      <template v-for="chartDataByChurch in listChartDataByChurch" :key="chartDataByChurch.church_id">
        <v-window-item :value="`chart-${chartDataByChurch.church_id}`">
          <template #default>
            <AttendanceChart :data="chartDataByChurch.attendanceData" :title="titleAttendance" />

            <GivingChart :data="chartDataByChurch.givingData" :title="titleGiving" />

            <VisitChart :data="chartDataByChurch.visitData" :title="titleVisit" />
          </template>
        </v-window-item>
      </template>
    </v-window>


    <!-- 👇 Đây là slot header (tùy chọn) -->
    <template #header>
      <div class="d-flex align-center justify-end" style="min-width: 180px;">
        <SelectInput v-model="periodModel" :items="periodOptions" @change="onChangePeriod" density="compact"
          hide-details style="max-width: 160px;" :clearable="false" />
      </div>
    </template>
  </CardHeader>
</template>

<style scoped></style>
