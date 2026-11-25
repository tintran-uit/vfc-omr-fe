<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import FormPageShell from "@/components/shared/FormPageShell.vue";
import CardHeader from "@/components/shared/CardHeader.vue";
import WatchlistPager from "@/components/watchlists/WatchlistPager.vue";
import { churchService } from "@/services/churchService";
import {
  mapWatchlistChurch,
  watchlistService,
  type WatchlistChurch,
} from "@/services/watchlistService";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const perPage = 10;
const isEdit = computed(() => route.name === "WatchlistEdit");
const watchlistId = computed(() => route.params.id);

const pageTitle = computed(() =>
  isEdit.value ? t("watchlist.editTitle") : t("watchlist.addTitle"),
);

const name = ref("");
const nameError = ref("");
const pending = ref(false);

const churches = ref<WatchlistChurch[]>([]);
const churchTotal = ref(0);
const churchPage = ref(1);
const churchQuery = ref("");
const churchLoading = ref(false);

const selected = ref<WatchlistChurch[]>([]);
const selectedQuery = ref("");
const selectedPage = ref(1);

const selectedIds = computed(() => new Set(selected.value.map((church) => church.id)));

const filteredSelected = computed(() => {
  const query = String(selectedQuery.value ?? "").trim().toLowerCase();
  if (!query) return selected.value;

  return selected.value.filter((church) => {
    return `${church.id} ${church.name}`.toLowerCase().includes(query);
  });
});

const selectedRows = computed(() => {
  const start = (selectedPage.value - 1) * perPage;
  return filteredSelected.value.slice(start, start + perPage);
});

let churchTimer: ReturnType<typeof setTimeout> | undefined;

async function loadChurches() {
  churchLoading.value = true;
  try {
    const params: Record<string, unknown> = {
      page: churchPage.value,
      limit: perPage,
      sort_by: "name",
      sort_desc: "false",
    };
    const query = String(churchQuery.value ?? "").trim();
    if (query) params.search = query;

    const data = await churchService.getList(params, false);
    const items = Array.isArray(data?.items) ? data.items : [];
    churches.value = items
      .map((item: Record<string, any>) => mapWatchlistChurch(item))
      .filter((item): item is WatchlistChurch => item != null);
    churchTotal.value = Number(data?.total ?? items.length);
  } catch (error) {
    console.error(error);
    churches.value = [];
    churchTotal.value = 0;
  } finally {
    churchLoading.value = false;
  }
}

function onChurchSearch() {
  if (churchTimer) clearTimeout(churchTimer);
  churchTimer = setTimeout(() => {
    if (churchPage.value !== 1) {
      churchPage.value = 1;
      return;
    }
    loadChurches().catch((error) => console.error(error));
  }, 400);
}

function toggleChurch(church: WatchlistChurch, checked: boolean | null) {
  if (checked) {
    if (!selectedIds.value.has(church.id)) {
      selected.value = [...selected.value, church];
    }
    return;
  }

  selected.value = selected.value.filter((item) => item.id !== church.id);
}

function removeSelected(id: number) {
  selected.value = selected.value.filter((item) => item.id !== id);
}

async function loadWatchlist() {
  if (!isEdit.value || watchlistId.value == null) return;
  const detail = await watchlistService.get(watchlistId.value as string);
  name.value = detail.name;
  selected.value = detail.churches;
}

async function save() {
  const trimmed = name.value.trim();
  if (!trimmed) {
    nameError.value = t("validation.required", { field: t("watchlist.name") });
    return;
  }

  nameError.value = "";
  pending.value = true;
  try {
    const payload = {
      name: trimmed,
      church_ids: selected.value.map((church) => church.id),
    };

    if (isEdit.value && watchlistId.value != null) {
      await watchlistService.update(watchlistId.value as string, payload);
    } else {
      await watchlistService.create(payload);
    }

    router.push({ name: "WatchlistList" });
  } catch (error) {
    console.error(error);
  } finally {
    pending.value = false;
  }
}

watch(churchPage, () => {
  loadChurches().catch((error) => console.error(error));
});

watch(selectedQuery, () => {
  selectedPage.value = 1;
});

watch(filteredSelected, (items) => {
  const lastPage = Math.max(1, Math.ceil(items.length / perPage));
  if (selectedPage.value > lastPage) selectedPage.value = lastPage;
});

onMounted(() => {
  loadWatchlist().catch((error) => console.error(error));
  loadChurches().catch((error) => console.error(error));
});
</script>

<template>
  <FormPageShell
    :title="pageTitle"
    :back-url="{ name: 'WatchlistList' }"
    no-card
  >
    <div class="mb-4">
      <v-label
        class="mb-1"
        for="watchlist-name"
      >
        {{ $t("watchlist.name") }}
        <span class="text-error">*</span>
      </v-label>
      <v-text-field
        id="watchlist-name"
        v-model="name"
        :error-messages="nameError"
        variant="outlined"
        density="compact"
        hide-details="auto"
        @update:model-value="nameError = ''"
      />
    </div>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <CardHeader :title="$t('watchlist.pickChurches')">
          <template #header>
            <v-text-field
              v-model="churchQuery"
              :placeholder="$t('watchlist.searchPlaceholder')"
              :loading="churchLoading"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              class="watchlist-form__search"
              @update:model-value="onChurchSearch"
            />
          </template>
          <v-table
            density="compact"
            class="bordered-table"
          >
            <thead>
              <tr>
                <th class="watchlist-form__check" />
                <th class="watchlist-form__id">{{ $t("id") }}</th>
                <th>{{ $t("watchlist.churchName") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="church in churches"
                :key="church.id"
              >
                <td>
                  <v-checkbox-btn
                    :model-value="selectedIds.has(church.id)"
                    color="primary"
                    @update:model-value="toggleChurch(church, $event)"
                  />
                </td>
                <td>{{ church.id }}</td>
                <td>{{ church.name }}</td>
              </tr>
              <tr v-if="!churches.length">
                <td
                  colspan="3"
                  class="text-center text-medium-emphasis"
                >
                  {{ $t("watchlist.emptyChurches") }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <WatchlistPager
            v-model:page="churchPage"
            :total="churchTotal"
            :per-page="perPage"
          />
        </CardHeader>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <CardHeader :title="$t('watchlist.addedChurches')">
          <template #header>
            <v-text-field
              v-model="selectedQuery"
              :placeholder="$t('watchlist.searchPlaceholder')"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              class="watchlist-form__search"
            />
          </template>
          <v-table
            density="compact"
            class="bordered-table"
          >
            <thead>
              <tr>
                <th class="watchlist-form__id">{{ $t("id") }}</th>
                <th>{{ $t("watchlist.churchName") }}</th>
                <th class="text-end watchlist-form__remove" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="church in selectedRows"
                :key="church.id"
              >
                <td>{{ church.id }}</td>
                <td>{{ church.name }}</td>
                <td class="text-end">
                  <v-btn
                    icon="$delete"
                    variant="text"
                    size="small"
                    color="error"
                    @click="removeSelected(church.id)"
                  />
                </td>
              </tr>
              <tr v-if="!selectedRows.length">
                <td
                  colspan="3"
                  class="text-center text-medium-emphasis"
                >
                  {{ $t("watchlist.emptyChurches") }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <WatchlistPager
            v-model:page="selectedPage"
            :total="filteredSelected.length"
            :per-page="perPage"
          />
        </CardHeader>
      </v-col>
    </v-row>

    <div class="d-flex justify-end mt-4">
      <v-btn
        color="primary"
        :loading="pending"
        @click="save"
      >
        {{ $t("save") }}
      </v-btn>
    </div>
  </FormPageShell>
</template>

<style scoped lang="scss">
.watchlist-form__search {
  width: 200px;
  max-width: 46vw;
}

.watchlist-form__check {
  width: 48px;
}

.watchlist-form__id {
  width: 88px;
}

.watchlist-form__remove {
  width: 96px;
}
</style>
