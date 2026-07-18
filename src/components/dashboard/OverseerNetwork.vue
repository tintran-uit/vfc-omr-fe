<script setup lang="ts">
import { computed } from "vue";
import CardHeader from "../shared/CardHeader.vue";

const props = withDefaults(
  defineProps<{
    data: any;
  }>(),
  {
    data: () => [],
  },
);

const hasData = computed(() => Array.isArray(props.data) && props.data.length > 0);
</script>

<template>
  <CardHeader title="Networks">
    <v-table
      v-if="hasData"
      class="text-no-wrap bordered-table table-in-card"
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
    <div
      v-else
      class="pa-4 text-center text-medium-emphasis"
    >
      {{ $t("noData") }}
    </div>
  </CardHeader>
</template>
