<script setup lang="ts">
import { ref, inject } from "vue";
import CardHeader from "../shared/CardHeader.vue";
import tableSchema from "@/table-schemas/overseerChurchTableSchema";
import DynamicTableDefault from "@/components/tables/DynamicTableDefault.vue";
import { tableOptionsToParams } from "@/helpers/dataTableHelper";
import { dashboardService } from "@/services/dashboardService";

// const props = withDefaults(defineProps<{}>(), {});

const items = ref([]);
const page = ref(1);
const itemsPerPage = ref(25);
const totalItems = ref(0);
const searches = ref([]);
const sortBy = ref([{ key: "id", order: "desc" }]);

const dashboardData = inject("dashboardData");

const fetchData = async function (options = {}) {
  const data = await dashboardService.getOverseerChurches(tableOptionsToParams(options), false);

  items.value = data.items;
  totalItems.value = data.total_pages;
};

const onUpdateOptions = (options) => {
  fetchData(options);
};
</script>

<template>
  <CardHeader :title="$t('church.myChurches')">
    <DynamicTableDefault
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:searches="searches"
      v-model:sort-by="sortBy"
      :total-items="totalItems"
      :headers="tableSchema.headers"
      :searches-config="tableSchema.searches"
      :items="items"
      @update:options="onUpdateOptions"
    >
      <template v-slot:item.data_entry_status="{ item }">
        <v-tooltip
          v-if="item.data_entry_status"
          :text="$t('church.upToDateGoodWork')"
        >
          <template #activator="{ props }">
            <v-icon color="success">$check</v-icon>
          </template>
        </v-tooltip>

        <v-tooltip
          v-else
          :text="$t('church.late')"
        >
          <template #activator="{ props }">
            <v-icon color="warning">$alertOutline</v-icon>
          </template>
        </v-tooltip>
      </template>
    </DynamicTableDefault>
  </CardHeader>
</template>

<style scoped></style>
