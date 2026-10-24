<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import DataTable from "@/components/tables/DataTable.vue";
import TablePageShell from "@/components/shared/TablePageShell.vue";
import TableSearchBox from "@/components/tables/TableSearchBox.vue";
import tableSchema from "@/table-schemas/eventTypeTableSchema";
import {
  eventTypesService,
  meetingTypeLabelKey,
  type EventType,
} from "@/services/eventTypesService";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const items = ref<EventType[]>([]);
const searches = ref([]);
const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref([{ key: "id", order: "asc" }]);

const actions = computed(() => [
  ...(authStore.can("event-types.update") ? ["edit"] : []),
  ...(authStore.can("event-types.delete") ? ["delete"] : []),
]);

function asRows(data: unknown): EventType[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const record = data as { data?: unknown; items?: unknown };
    if (Array.isArray(record.data)) return record.data;
    if (Array.isArray(record.items)) return record.items;
  }
  return [];
}

async function fetchData() {
  items.value = asRows(await eventTypesService.getAll());
}

function meetingLabel(value: unknown) {
  const key = meetingTypeLabelKey(value);
  return key ? t(key) : String(value ?? "");
}

function onEdit(item: unknown) {
  const it = item as { id: number | string };
  router.push({ name: "EventTypeEdit", params: { id: it.id } });
}

async function onDelete(item: unknown) {
  const it = item as { id: number | string };
  await eventTypesService.del(it.id);
  await fetchData();
}

function onSearch() {
  page.value = 1;
}

onMounted(() => {
  fetchData().catch((error) => console.error(error));
});
</script>

<template>
  <TablePageShell
    title-key="eventType.listTitle"
    :title-md="4"
    :header-right-md="8"
  >
    <template #header-right>
      <TableSearchBox
        v-model:searches="searches"
        :searches-config="tableSchema.searches"
        inline
        @search="onSearch"
      />
      <v-btn
        v-if="authStore.can('event-types.create')"
        color="primary"
        variant="outlined"
        :to="{ name: 'EventTypeAdd' }"
      >
        <v-icon>$plus</v-icon>
        {{ $t("mainMenu.eventTypeAdd") }}
      </v-btn>
    </template>

    <DataTable
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      v-model:searches="searches"
      :headers="tableSchema.headers"
      :items="items"
      :enabled-actions="actions"
      @action:edit="onEdit"
      @action:delete="onDelete"
    >
      <template #item.color="{ item }">
        <span class="d-inline-flex align-center ga-2">
          <span>{{ item.color }}</span>
          <span
            class="event-type-swatch"
            :style="{ background: item.color }"
          />
        </span>
      </template>
      <template #item.cell_color="{ item }">
        <span class="d-inline-flex align-center ga-2">
          <span>{{ item.cell_color }}</span>
          <span
            class="event-type-swatch"
            :style="{ background: item.cell_color }"
          />
        </span>
      </template>
      <template #item.meeting_type="{ item }">
        {{ meetingLabel(item.meeting_type) }}
      </template>
    </DataTable>
  </TablePageShell>
</template>

<style scoped lang="scss">
.event-type-swatch {
  width: 28px;
  height: 18px;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  flex: 0 0 auto;
}
</style>
