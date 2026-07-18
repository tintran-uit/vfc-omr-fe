<script setup lang="ts">
import { nextTick, ref } from "vue";
import CardHeader from "../shared/CardHeader.vue";
import TableSearchBox from "@/components/tables/TableSearchBox.vue";
import tableSchema from "@/table-schemas/overseerChurchTableSchema";
import DynamicTableDefault from "@/components/tables/DynamicTableDefault.vue";
import { tableOptionsToParams } from "@/helpers/dataTableHelper";
import { dashboardService } from "@/services/dashboardService";

const items = ref([]);
const page = ref(1);
const itemsPerPage = ref(25);
const totalItems = ref(0);
const searches = ref<Array<{ key: string; value: unknown }>>([]);
const sortBy = ref([{ key: "id", order: "desc" }]);

let fetchSeq = 0;

const buildOptions = () => ({
  page: page.value,
  itemsPerPage: itemsPerPage.value,
  sortBy: sortBy.value,
  searches: searches.value,
});

const fetchData = async function (options: Record<string, unknown> = {}) {
  const seq = ++fetchSeq;
  const data = await dashboardService.getOverseerChurches(
    tableOptionsToParams({
      ...options,
      // always prefer parent searches so table update:options cannot wipe the filter
      searches: searches.value,
    }),
    false,
  );

  if (seq !== fetchSeq) return;

  items.value = data.items;
  totalItems.value = data.total_pages;
};

const onUpdateOptions = (options: Record<string, unknown>) => {
  fetchData(options);
};

const onSearch = async (payload: Array<{ key: string; value: unknown }> = []) => {
  searches.value = payload;
  if (page.value !== 1) {
    page.value = 1;
  }
  await nextTick();
  await fetchData(buildOptions());
};
</script>

<template>
  <CardHeader :title="$t('church.myChurches')">
    <template #header>
      <TableSearchBox
        v-model:searches="searches"
        :searches-config="tableSchema.searches"
        inline
        @search="onSearch"
      />
    </template>

    <DynamicTableDefault
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:searches="searches"
      v-model:sort-by="sortBy"
      :hide-title="true"
      :hide-header="true"
      :total-items="totalItems"
      :headers="tableSchema.headers"
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
