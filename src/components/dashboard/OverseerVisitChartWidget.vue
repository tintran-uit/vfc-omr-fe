<script setup lang="ts">
import { ref, watch, computed, onMounted, defineAsyncComponent } from "vue";
import CardHeader from "../shared/CardHeader.vue";
import OverseerVisitChart from "@/components/charts/OverseerVisitChart.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = withDefaults(
  defineProps<{
    data: any;
  }>(),
  {},
);
</script>

<template>
  <CardHeader title="Pastoral Visits in the Last 12 Months">
    <OverseerVisitChart :data="data" />
  </CardHeader>
</template>

<style scoped></style>
