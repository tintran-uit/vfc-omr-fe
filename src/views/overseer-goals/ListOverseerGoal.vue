<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import DynamicTableDefault from "@/components/tables/DynamicTableDefault.vue";
import TablePageShell from "@/components/shared/TablePageShell.vue";
import TableSearchBox from "@/components/tables/TableSearchBox.vue";
import tableSchema from "@/table-schemas/overseerGoalTableSchema";
import { tableOptionsToParams } from "@/helpers/dataTableHelper";
import { goalPeriodService } from "@/services/goalPeriodService";

const router = useRouter();
const items = ref<Record<string, unknown>[]>([]);
const page = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const searches = ref([]);
const sortBy = ref([{ key: "id", order: "asc" }]);

function asList(data: unknown) {
  const record = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const rows = Array.isArray(data)
    ? data
    : Array.isArray(record.items)
      ? record.items
      : [];
  const total = Number(record.total ?? record.total_items ?? record.count ?? rows.length);
  return {
    items: rows as Record<string, unknown>[],
    total: Number.isFinite(total) ? total : rows.length,
  };
}

const buildOptions = () => ({
  page: page.value,
  itemsPerPage: itemsPerPage.value,
  sortBy: sortBy.value,
  searches: searches.value,
});

async function fetchData(options = {}) {
  const data = await goalPeriodService.list(tableOptionsToParams(options));
  const list = asList(data);
  items.value = list.items.map((item) => ({
    ...item,
    years: `${item.start_year ?? ""} - ${item.end_year ?? ""}`,
  }));
  totalItems.value = list.total;
}

function onUpdateOptions(options) {
  fetchData(options);
}

function onSearch() {
  fetchData(buildOptions());
}

function onGoals(item: { id?: number | string }) {
  if (item?.id == null) return;
  router.push({ name: "OverseerGoalGoals", params: { id: item.id } });
}

function onEdit(item: { id?: number | string }) {
  if (item?.id == null) return;
  router.push({ name: "OverseerGoalEdit", params: { id: item.id } });
}

async function onDelete(item: { id?: number | string }) {
  if (item?.id == null) return;
  await goalPeriodService.del(item.id);
  fetchData(buildOptions());
}
</script>

<template>
  <TablePageShell title-key="overseerGoal.listTitle">
    <template #header-right>
      <TableSearchBox
        v-model:searches="searches"
        :searches-config="tableSchema.searches"
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
      :enabled-actions="['goals', 'edit', 'delete']"
      :text-actions="['goals', 'edit']"
      :action-titles="{ goals: 'overseerGoal.editGoals', edit: 'overseerGoal.editParameters' }"
      @action:goals="onGoals"
      @action:edit="onEdit"
      @action:delete="onDelete"
      @update:options="onUpdateOptions"
    >
      <template #item.user_name="{ item }">
        <router-link
          v-if="item.user_id"
          class="dt-cell-link"
          :to="{ name: 'UserDetail', params: { id: item.user_id } }"
        >
          {{ item.user_name }}
        </router-link>
        <span v-else>{{ item.user_name || "—" }}</span>
      </template>
      <template #item.local_church_name="{ item }">
        <router-link
          v-if="item.local_church_id"
          class="dt-cell-link"
          :to="{ name: 'ChurchDetail', params: { id: item.local_church_id } }"
        >
          {{ item.local_church_name }}
        </router-link>
        <span v-else>{{ item.local_church_name || "—" }}</span>
      </template>
    </DynamicTableDefault>
  </TablePageShell>
</template>
