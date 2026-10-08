<script setup lang="ts">
import OverseerAttendanceChartWidget from "@/components/dashboard/OverseerAttendanceChartWidget.vue";
import OverseerChurchPlantedChartWidget from "@/components/dashboard/OverseerChurchPlantedChartWidget.vue";
import OverseerVisitChartWidget from "@/components/dashboard/OverseerVisitChartWidget.vue";
import OverseerMetricBlock from "@/components/dashboard/OverseerMetricBlock.vue";
import OverseerUser from "@/components/dashboard/OverseerUser.vue";

const props = defineProps<{
  dashboardData: any;
}>();

function graphPayload(key: string) {
  const candidates = [
    props.dashboardData?.overseer_indicators?.[key],
    props.dashboardData?.[key],
  ];
  const withRows = candidates.find((graph) => Array.isArray(graph?.data) && graph.data.length);
  if (withRows) return withRows;
  return candidates.find(Boolean) ?? {};
}
</script>

<template>
  <div class="overseer-my-overseer-item mt-4">
    <v-row>
      <v-col cols="12">
        <OverseerUser
          v-if="dashboardData?.overseer_profile"
          :user-id="dashboardData.overseer_profile.id"
          :user="dashboardData.overseer_profile"
          :permissions="dashboardData.overseer_permissions"
        />
      </v-col>
    </v-row>

    <OverseerMetricBlock :indicators="dashboardData?.overseer_indicators" />

    <div class="d-flex flex-column ga-4 mt-4">
      <OverseerAttendanceChartWidget :data="graphPayload('attendance_graph')" />
      <OverseerChurchPlantedChartWidget :data="graphPayload('church_planted_graph')" />
      <OverseerVisitChartWidget :data="graphPayload('pastoral_visits_graph')" />
    </div>
  </div>
</template>
