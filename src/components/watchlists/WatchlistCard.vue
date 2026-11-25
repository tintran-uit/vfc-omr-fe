<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import DynamicTableDefault from "@/components/tables/DynamicTableDefault.vue";
import tableSchema from "@/table-schemas/watchlistChurchTableSchema";
import type { Watchlist, WatchlistChurch } from "@/services/watchlistService";

const props = defineProps<{
  watchlist: Watchlist;
}>();

const emit = defineEmits<{
  delete: [id: number];
  removeChurch: [watchlistId: number, church: WatchlistChurch];
}>();

const router = useRouter();
const search = ref("");
const page = ref(1);
const itemsPerPage = ref(25);
const sortBy = ref([{ key: "id", order: "desc" }]);

const filtered = computed(() => {
  const query = String(search.value ?? "").trim().toLowerCase();
  if (!query) return props.watchlist.churches;

  return props.watchlist.churches.filter((church) => {
    return [church.name, church.country, church.city, church.pastor, String(church.id)]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
});

const sorted = computed(() => {
  const list = [...filtered.value];
  const sort = sortBy.value?.[0];
  if (!sort?.key) return list;

  const field: Record<string, keyof WatchlistChurch> = {
    id: "id",
    name: "name",
    country_name: "country",
    city: "city",
    pastor_name: "pastor",
  };
  const key = field[sort.key] ?? "id";
  const direction = sort.order === "desc" ? -1 : 1;

  return list.sort((a, b) => {
    return String(a[key] ?? "").localeCompare(String(b[key] ?? ""), undefined, { numeric: true }) * direction;
  });
});

const rows = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return sorted.value.slice(start, start + itemsPerPage.value).map((church) => ({
    id: church.id,
    name: church.name,
    country_name: church.country,
    city: church.city,
    pastor_name: church.pastor,
    isMsc: church.isMsc,
    isMother: church.isMother,
  }));
});

watch(search, () => {
  page.value = 1;
});

watch(filtered, (items) => {
  const lastPage = Math.max(1, Math.ceil(items.length / itemsPerPage.value));
  if (page.value > lastPage) page.value = lastPage;
});

function edit() {
  router.push({ name: "WatchlistEdit", params: { id: props.watchlist.id } });
}

function onRemoveChurch(item: { id: number }) {
  const church = props.watchlist.churches.find((entry) => entry.id === item.id);
  if (!church) return;
  emit("removeChurch", props.watchlist.id, church);
}
</script>

<template>
  <v-card
    variant="outlined"
    elevation="0"
    class="bg-surface mb-4"
  >
    <v-card-item class="bg-grey-lighten-4">
      <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3">
        <v-card-title class="text-h5 text-high-emphasis pa-0">
          {{ watchlist.name }}
        </v-card-title>
        <div class="d-flex align-center ga-2">
          <v-text-field
            v-model="search"
            :placeholder="$t('watchlist.searchPlaceholder')"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="watchlist-card__search"
          />
          <v-btn
            icon="$edit"
            variant="text"
            size="small"
            color="primary"
            @click="edit"
          />
          <v-btn
            icon="$delete"
            variant="text"
            size="small"
            color="error"
            @click="emit('delete', watchlist.id)"
          />
        </div>
      </div>
    </v-card-item>
    <v-divider />

    <DynamicTableDefault
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      hide-title
      hide-header
      :total-items="filtered.length"
      :headers="tableSchema.headers"
      :items="rows"
      :enabled-actions="['delete']"
      @action:delete="onRemoveChurch"
    >
      <template #item.name="{ item }">
        <div class="watchlist-church-name">
          <router-link
            class="dt-cell-link"
            :to="{ name: 'ChurchDetail', params: { id: item.id } }"
          >
            {{ item.name }}
          </router-link>
          <v-chip
            v-if="item.isMsc"
            color="warning"
            :text="$t('church.msc')"
            size="small"
            label
          />
          <v-chip
            v-if="item.isMother"
            color="success"
            :text="$t('church.mother')"
            size="small"
            label
          />
        </div>
      </template>
    </DynamicTableDefault>
  </v-card>
</template>

<style scoped lang="scss">
.watchlist-card__search {
  width: 220px;
  max-width: 100%;
}

.watchlist-church-name {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  max-width: 100%;
}

.watchlist-church-name :deep(.dt-cell-link) {
  flex: 1 1 auto;
  min-width: 0;
  width: auto;
}
</style>
