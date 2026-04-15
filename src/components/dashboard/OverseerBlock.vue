<script setup lang="ts">
import { inject } from "vue";
import CardHeader from "../shared/CardHeader.vue";
import { userService } from "@/services/userService";
import { useI18n } from "vue-i18n";

const props = withDefaults(
  defineProps<{
    userId: number;
  }>(),
  {},
);
const { t } = useI18n();

const dashboard = inject("dashboard");

const headingClass = "text-left font-weight-medium";
</script>

<template>
  <CardHeader :title="dashboard?.overseer_profile?.name">
    <v-table
      class="text-no-wrap bordered-table"
      density="compact"
      hover
    >
      <tbody>
        <tr>
          <th :class="headingClass">{{ $t("user.omrRole") }}</th>
          <td>{{ dashboard?.overseer_profile?.role_name }}</td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t("user.geographicalRegion") }}</th>
          <td>
            {{
              dashboard?.overseer_permissions?.allowedIds?.geographicalRegionIds
                ?.map((i) => i.name)
                .join(", ")
            }}
          </td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t("user.languageRegion") }}</th>
          <td>
            {{
              dashboard?.overseer_permissions?.allowedIds?.languageRegionIds
                ?.map((i) => i.name)
                .join(", ")
            }}
          </td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t("user.churchApostolicRegions") }}</th>
          <td>
            {{
              dashboard?.overseer_permissions?.allowedIds?.churchRegionIds
                ?.map((i) => i.name)
                .join(", ")
            }}
          </td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t("user.churchApostolicRegionExclusions") }}</th>
          <td>
            {{
              dashboard?.overseer_permissions?.excludedIds?.churchRegionIds
                ?.map((i) => i.name)
                .join(", ")
            }}
          </td>
        </tr>
        <tr>
          <th :class="headingClass">{{ $t("user.labelEmailAddress") }}</th>
          <td>{{ dashboard?.overseer_profile?.email }}</td>
        </tr>
      </tbody>
    </v-table>
  </CardHeader>
</template>

<style scoped>
.bordered-table {
  border: 1px solid #ddd;
  width: 100%;
  font-size: 0.9rem;
}

.bordered-table th,
.bordered-table td {
  border-bottom: 1px solid #ddd;
  padding: 6px 12px !important;
  vertical-align: middle;
}

.bordered-table th {
  background-color: #f8f8f8;
  width: 35%;
  font-weight: 600;
  color: #333;
}

.bordered-table tr:last-child th,
.bordered-table tr:last-child td {
  border-bottom: none;
}
</style>
