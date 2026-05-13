<script setup lang="ts">
import { ref, watch, computed, onMounted, defineAsyncComponent } from "vue";
import CardHeader from "../shared/CardHeader.vue";

const props = withDefaults(
  defineProps<{
    data: any;
  }>(),
  {},
);
</script>

<template>
  <CardHeader title="Church Apostolic Regions">
    <v-table
      class="text-no-wrap bordered-table"
      density="compact"
      hover
    >
      <thead>
        <tr>
          <th rowspan="2">{{ $t("id") }}</th>
          <th rowspan="2">{{ $t("name") }}</th>
          <th rowspan="2">{{ $t("numberChurchesInRegionAndSubRegions") }}</th>
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
