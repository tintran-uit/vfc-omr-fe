<script setup lang="ts">
import { computed, inject, unref } from "vue";

import CardHeader from "../shared/CardHeader.vue";

const props = withDefaults(
  defineProps<{
    userId: number;
    user: any;
    permissions?: any;
  }>(),
  {},
);

const injectedDashboard = inject("dashboardData", null);

const permissions = computed(
  () => props.permissions ?? unref(injectedDashboard)?.overseer_permissions,
);

const headingClass = "text-left font-weight-medium";
</script>

<template>
  <CardHeader :title="user?.name">
    <v-table
      v-if="user"
      class="bordered-table table-in-card table-key-value"
      density="compact"
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
              permissions?.allowedIds?.geographicalRegionIds
                ?.map((i) => i.name)
                .join(", ")
            }}
          </td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t("user.languageRegion") }}</th>
          <td>
            {{
              permissions?.allowedIds?.languageRegionIds
                ?.map((i) => i.name)
                .join(", ")
            }}
          </td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t("user.churchApostolicRegions") }}</th>
          <td>
            {{
              permissions?.allowedIds?.churchRegionIds
                ?.map((i) => i.name)
                .join(", ")
            }}
          </td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t("user.churchApostolicRegionExclusions") }}</th>
          <td>
            {{
              permissions?.excludedIds?.churchRegionIds
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
    <div
      v-else
      class="pa-4 text-center text-medium-emphasis"
    >
      {{ $t("noData") }}
    </div>
  </CardHeader>
</template>
