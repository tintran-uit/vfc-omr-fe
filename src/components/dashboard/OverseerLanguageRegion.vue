<script setup lang="ts">
import { ref, watch, computed, onMounted, defineAsyncComponent } from "vue";
import CardHeader from "../shared/CardHeader.vue";

const props = withDefaults(
  defineProps<{
    data: any;
  }>(),
  {},
);

const headingClass = "text-left font-weight-medium";
</script>

<template>
  <CardHeader title="Language Regions">
    <v-table
      class="text-no-wrap bordered-table"
      density="compact"
      hover
    >
      <thead>
        <tr>
          <th>{{ $t("id") }}</th>
          <th>{{ $t("name") }}</th>
          <th>{{ $t("numberChurchesInRegionAndSubRegions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in data"
          :key="row.id"
        >
          <td>{{ row.id }}</td>
          <td>
            <a href="#">{{ row.name }}</a>
          </td>
          <td>{{ row.count }}</td>
        </tr>
      </tbody>
    </v-table>
  </CardHeader>
</template>

<style scoped></style>
