<script setup lang="ts">
import { ref, watch, computed, onMounted, defineAsyncComponent } from "vue";
import CardHeader from "../shared/CardHeader.vue";
import OverseerAttendanceChart from "@/components/charts/OverseerAttendanceChart.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = withDefaults(
  defineProps<{
    data: any;
  }>(),
  {},
);

const transformedData = ref([]);

function transformAttendanceData(data) {
  const currentYear = Math.max(...data.map((d) => d.year));
  const lastYear = currentYear - 1;
  const yearBeforeLast = currentYear - 2;

  const map = new Map();

  data.forEach((d) => {
    if (!map.has(d.week_number)) {
      map.set(d.week_number, {
        week: d.week_number,
        currentYear: null,
        lastYear: null,
        yearBeforeLast: null,
      });
    }

    const item = map.get(d.week_number);

    if (d.year === currentYear) item.currentYear = d.attendance;
    if (d.year === lastYear) item.lastYear = d.attendance;
    if (d.year === yearBeforeLast) item.yearBeforeLast = d.attendance;
  });

  return Array.from(map.values()).sort((a, b) => a.week - b.week);
}

watch(
  () => props.data,
  (newVal) => {
    if (!Array.isArray(newVal) || newVal.length === 0) return;

    transformedData.value = transformAttendanceData(newVal);
  },
  { immediate: true },
);
</script>

<template>
  <CardHeader :title="$t('chart.attendanceGraph')">
    <OverseerAttendanceChart :data="transformedData" />
  </CardHeader>
</template>

<style scoped></style>
