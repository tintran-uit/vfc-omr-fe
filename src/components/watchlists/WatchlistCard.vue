<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import WatchlistPager from "@/components/watchlists/WatchlistPager.vue";
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
const perPage = 10;

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

const rows = computed(() => {
  const start = (page.value - 1) * perPage;
  return filtered.value.slice(start, start + perPage);
});

watch(search, () => {
  page.value = 1;
});

watch(filtered, (items) => {
  const lastPage = Math.max(1, Math.ceil(items.length / perPage));
  if (page.value > lastPage) page.value = lastPage;
});

function edit() {
  router.push({ name: "WatchlistEdit", params: { id: props.watchlist.id } });
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

    <v-table
      density="compact"
      class="bordered-table"
    >
      <thead>
        <tr>
          <th class="watchlist-card__id">{{ $t("id") }}</th>
          <th>{{ $t("watchlist.churchName") }}</th>
          <th>{{ $t("watchlist.country") }}</th>
          <th>{{ $t("watchlist.city") }}</th>
          <th>{{ $t("watchlist.pastor") }}</th>
          <th class="text-end watchlist-card__remove">{{ $t("user.assignRemove") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="church in rows"
          :key="church.id"
        >
          <td>{{ church.id }}</td>
          <td>
            <router-link
              class="text-primary"
              :to="{ name: 'ChurchDetail', params: { id: church.id } }"
            >
              {{ church.name }}
            </router-link>
            <v-chip
              v-if="church.isMsc"
              color="warning"
              :text="$t('church.msc')"
              class="ms-2"
              size="small"
              label
            />
            <v-chip
              v-if="church.isMother"
              color="success"
              :text="$t('church.mother')"
              class="ms-2"
              size="small"
              label
            />
          </td>
          <td>{{ church.country || "—" }}</td>
          <td>{{ church.city || "—" }}</td>
          <td>{{ church.pastor || "—" }}</td>
          <td class="text-end">
            <v-btn
              icon="$delete"
              variant="text"
              size="small"
              color="error"
              @click="emit('removeChurch', watchlist.id, church)"
            />
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td
            colspan="6"
            class="text-medium-emphasis"
          >
            {{ $t("watchlist.emptyChurches") }}
          </td>
        </tr>
      </tbody>
    </v-table>

    <WatchlistPager
      v-model:page="page"
      :total="filtered.length"
      :per-page="perPage"
    />
  </v-card>
</template>

<style scoped lang="scss">
.watchlist-card__search {
  width: 220px;
  max-width: 100%;
}

.watchlist-card__id {
  width: 72px;
}

.watchlist-card__remove {
  width: 96px;
}
</style>
