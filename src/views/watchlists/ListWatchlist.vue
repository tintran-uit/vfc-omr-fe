<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import TablePageShell from "@/components/shared/TablePageShell.vue";
import WatchlistCard from "@/components/watchlists/WatchlistCard.vue";
import { useDialogStore } from "@/stores/dialogStore";
import {
  watchlistService,
  type Watchlist,
  type WatchlistChurch,
} from "@/services/watchlistService";

const { t } = useI18n();
const dialogStore = useDialogStore();
const watchlists = ref<Watchlist[]>([]);

async function load() {
  watchlists.value = await watchlistService.list();
}

async function onDelete(id: number) {
  const confirmed = await dialogStore.confirm(t("areYouSureWantToDelete"));
  if (!confirmed) return;

  await watchlistService.remove(id);
  watchlists.value = watchlists.value.filter((item) => item.id !== id);
}

async function onRemoveChurch(watchlistId: number, church: WatchlistChurch) {
  await watchlistService.removeChurch(watchlistId, church.id);
  const watchlist = watchlists.value.find((item) => item.id === watchlistId);
  if (!watchlist) return;
  watchlist.churches = watchlist.churches.filter((item) => item.id !== church.id);
}

onMounted(() => {
  load().catch((error) => console.error(error));
});
</script>

<template>
  <TablePageShell
    title-key="watchlist.listTitle"
    :with-card="false"
  >
    <template #header-right>
      <v-btn
        color="primary"
        variant="outlined"
        :to="{ name: 'WatchlistAdd' }"
      >
        <v-icon start>$plus</v-icon>
        {{ $t("mainMenu.watchListAdd") }}
      </v-btn>
    </template>

    <p
      v-if="!watchlists.length"
      class="text-body-1 text-medium-emphasis"
    >
      {{ $t("watchlist.empty") }}
    </p>

    <WatchlistCard
      v-for="watchlist in watchlists"
      :key="watchlist.id"
      :watchlist="watchlist"
      @delete="onDelete"
      @remove-church="onRemoveChurch"
    />
  </TablePageShell>
</template>
