<script setup lang="ts">
import { inject } from "vue";
import CardHeader from "../shared/CardHeader.vue";
import { userService } from "@/services/userService";

const props = withDefaults(
  defineProps<{
    userId: number;
    user: any;
  }>(),
  {},
);

const dashboardData = inject("dashboardData");

const headingClass = "text-left font-weight-medium";
</script>

<template>
  <CardHeader :title="user?.name">
    <v-table
      class="text-no-wrap bordered-table"
      density="compact"
      hover
    >
      <tbody>
        <tr>
          <th :class="headingClass">{{ $t("user.omrRole") }}</th>
          <td>{{ user?.role_name }}</td>
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
          <td>{{ user?.email }}</td>
        </tr>
      </tbody>
    </v-table>
  </CardHeader>
</template>

<style scoped></style>
