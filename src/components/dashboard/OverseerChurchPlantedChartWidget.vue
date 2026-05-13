<script setup lang="ts">
import { ref, watch, computed, onMounted, defineAsyncComponent } from "vue";
import CardHeader from "../shared/CardHeader.vue";
import OverseerChurchPlantedChart from "@/components/charts/OverseerChurchPlantedChart.vue";
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
  <CardHeader title="Churches Planted Annually Over the Last 10 Years">
    <OverseerChurchPlantedChart :data="data" />
  </CardHeader>
</template>

<style scoped></style>
