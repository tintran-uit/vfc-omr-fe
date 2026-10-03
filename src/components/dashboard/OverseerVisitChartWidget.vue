<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import CardHeader from "../shared/CardHeader.vue";
import OverseerVisitChart from "@/components/charts/OverseerVisitChart.vue";

const { t } = useI18n();
const props = withDefaults(
  defineProps<{
    data: any;
    title?: string;
  }>(),
  {},
);

const chartData = computed(() => {
  if (Array.isArray(props.data)) return props.data;
  if (Array.isArray(props.data?.data)) return props.data.data;
  return [];
});

const chartTitle = computed(() => {
  const fromApi = [props.title, props.data?.graph_title].find(
    (value) => typeof value === "string" && value.trim(),
  );
  return fromApi?.trim() || t("chart.pastoralVisitsGraph");
});
</script>

<template>
  <CardHeader :title="chartTitle">
    <OverseerVisitChart :data="chartData" />
  </CardHeader>
</template>
