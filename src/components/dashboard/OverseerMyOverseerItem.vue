<script setup lang="ts">
import OverseerAttendanceChartWidget from "@/components/dashboard/OverseerAttendanceChartWidget.vue";
import OverseerChurchPlantedChartWidget from "@/components/dashboard/OverseerChurchPlantedChartWidget.vue";
import OverseerVisitChartWidget from "@/components/dashboard/OverseerVisitChartWidget.vue";
import OverseerMetricBlock from "@/components/dashboard/OverseerMetricBlock.vue";

const props = defineProps<{
  dashboardData: any;
}>();

const headingClass = "text-left font-weight-medium";

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
  <v-card
    variant="outlined"
    elevation="0"
    class="bg-surface overseer-my-overseer-item mt-4"
  >
    <v-card-item>
      <v-card-title class="text-h5">
        {{ dashboardData?.overseer_profile?.name }}
      </v-card-title>
    </v-card-item>

    <v-divider />

    <v-card-text class="d-flex flex-column ga-4">
      <v-table
        class="text-no-wrap bordered-table"
        density="compact"
        hover
      >
        <tbody>
          <tr>
            <th :class="headingClass">{{ $t("user.omrRole") }}</th>
            <td>{{ dashboardData?.overseer_profile?.role_name }}</td>
          </tr>
          <tr>
            <th :class="headingClass">{{ $t("user.geographicalRegion") }}</th>
            <td>
              {{
                dashboardData?.overseer_permissions?.allowedIds?.geographicalRegionIds
                  ?.map((i) => i.name)
                  .join(", ")
              }}
            </td>
          </tr>
          <tr>
            <th :class="headingClass">{{ $t("user.languageRegion") }}</th>
            <td>
              {{
                dashboardData?.overseer_permissions?.allowedIds?.languageRegionIds
                  ?.map((i) => i.name)
                  .join(", ")
              }}
            </td>
          </tr>
          <tr>
            <th :class="headingClass">{{ $t("user.churchApostolicRegions") }}</th>
            <td>
              {{
                dashboardData?.overseer_permissions?.allowedIds?.churchRegionIds
                  ?.map((i) => i.name)
                  .join(", ")
              }}
            </td>
          </tr>
          <tr>
            <th :class="headingClass">{{ $t("user.churchApostolicRegionExclusions") }}</th>
            <td>
              {{
                dashboardData?.overseer_permissions?.excludedIds?.churchRegionIds
                  ?.map((i) => i.name)
                  .join(", ")
              }}
            </td>
          </tr>
          <tr>
            <th :class="headingClass">{{ $t("user.labelEmailAddress") }}</th>
            <td>{{ dashboardData?.overseer_profile?.email }}</td>
          </tr>
        </tbody>
      </v-table>

      <OverseerMetricBlock :indicators="dashboardData?.overseer_indicators" />

      <OverseerAttendanceChartWidget :data="graphPayload('attendance_graph')" />

      <OverseerChurchPlantedChartWidget :data="graphPayload('church_planted_graph')" />

      <OverseerVisitChartWidget :data="graphPayload('pastoral_visits_graph')" />
    </v-card-text>
  </v-card>
</template>
