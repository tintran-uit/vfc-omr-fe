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

function namesOf(items?: { name?: string }[]) {
  return items?.map((item) => item.name).filter(Boolean).join(", ") ?? "";
}
</script>

<template>
  <CardHeader :title="user?.name">
    <v-row
      v-if="user"
      no-gutters
      class="overseer-user-columns"
    >
      <v-col cols="12" md="6">
        <v-table
          class="bordered-table table-in-card table-key-value"
          density="compact"
        >
          <tbody>
            <tr>
              <th :class="headingClass">{{ $t("user.omrRole") }}</th>
              <td>{{ user?.role_name }}</td>
            </tr>
            <tr>
              <th :class="headingClass">{{ $t("user.labelEmailAddress") }}</th>
              <td>{{ user?.email }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="12" md="6">
        <v-table
          class="bordered-table table-in-card table-key-value"
          density="compact"
        >
          <tbody>
            <tr>
              <th :class="headingClass">{{ $t("user.geographicalRegion") }}</th>
              <td>{{ namesOf(permissions?.allowedIds?.geographicalRegionIds) }}</td>
            </tr>
            <tr>
              <th :class="headingClass">{{ $t("user.languageRegion") }}</th>
              <td>{{ namesOf(permissions?.allowedIds?.languageRegionIds) }}</td>
            </tr>
            <tr>
              <th :class="headingClass">{{ $t("user.churchApostolicRegions") }}</th>
              <td>{{ namesOf(permissions?.allowedIds?.churchRegionIds) }}</td>
            </tr>
            <tr>
              <th :class="headingClass">{{ $t("user.churchApostolicRegionExclusions") }}</th>
              <td>{{ namesOf(permissions?.excludedIds?.churchRegionIds) }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <div
      v-else
      class="pa-4 text-center text-medium-emphasis"
    >
      {{ $t("noData") }}
    </div>
  </CardHeader>
</template>

<style scoped>
.overseer-user-columns :deep(.v-table.table-key-value .v-table__wrapper > table > tbody > tr > th) {
  width: 46%;
  max-width: none;
}

@media (min-width: 960px) {
  .overseer-user-columns :deep(.v-col:last-child) {
    border-left: 1px solid rgb(var(--v-theme-borderLight));
  }
}

@media (max-width: 959px) {
  .overseer-user-columns :deep(.v-col:last-child) {
    border-top: 1px solid rgb(var(--v-theme-borderLight));
  }
}
</style>
