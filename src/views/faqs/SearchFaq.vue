<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores/languageStore";
import { faqService } from "@/services/faqService";
import DataTable from "@/components/tables/DataTable.vue";
import tableSchema from "@/table-schemas/faqSearchTableSchema";
import TablePageShell from "@/components/shared/TablePageShell.vue";

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const languageStore = useLanguageStore();
const items = ref<unknown[]>([]);
const searches = ref<Array<{ key: string; value: unknown }>>([]);
const page = ref(1);
const itemsPerPage = ref(25);
const sortBy = ref([{ key: "id", order: "desc" as const }]);

const searchText = ref("");
const languageId = ref<number | null>(null);
const hasSearched = ref(false);

/** v-text-field clearable may set model to null */
const searchTextTrimmed = computed(() => String(searchText.value ?? "").trim());

const canSearch = computed(
  () => searchTextTrimmed.value.length > 0 && languageId.value != null,
);

const emptyMessage = computed(() =>
  hasSearched.value ? t("faq.empty") : t("faq.searchEmptyHint"),
);

function queryParams() {
  const p: Record<string, string | number | undefined | null> = {};
  if (searchTextTrimmed.value) p.question_header = searchTextTrimmed.value;
  if (languageId.value != null) p.language_id = languageId.value;
  return p;
}

const runSearch = async () => {
  if (!canSearch.value) return;
  hasSearched.value = true;
  page.value = 1;
  items.value = await faqService.list(queryParams());
};

let searchDebounce: ReturnType<typeof setTimeout> | null = null;

function scheduleSearch() {
  if (searchDebounce) clearTimeout(searchDebounce);

  if (!canSearch.value) {
    items.value = [];
    hasSearched.value = false;
    return;
  }

  searchDebounce = setTimeout(() => {
    void runSearch();
  }, 400);
}

watch(searchText, scheduleSearch);
watch(languageId, scheduleSearch);

function applyDefaultLanguage() {
  if (languageId.value != null) return;
  const first = languageStore.options[0];
  if (first?.id == null) return;
  languageId.value = Number(first.id);
}

watch(
  () => languageStore.options,
  () => applyDefaultLanguage(),
  { immediate: true },
);

onMounted(async () => {
  await languageStore.fetchForOptions();
  applyDefaultLanguage();
});
</script>

<template>
  <TablePageShell title-key="faq.searchTitle">
    <template #header-right>
      <div class="faq-search-toolbar d-flex flex-column flex-sm-row flex-wrap ga-3 align-sm-center justify-sm-end w-100">
        <div class="faq-search-filters d-flex flex-column flex-md-row align-stretch align-md-center ga-3">
          <v-text-field
            v-model="searchText"
            :label="t('faq.search')"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="faq-search-field"
          />
          <LanguageSelectInput
            v-model="languageId"
            :label="t('faq.language')"
            label-on-field
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="faq-search-field faq-search-field--language"
          />
        </div>
        <v-btn
          v-if="authStore.can('faq.create')"
          color="primary"
          variant="outlined"
          @click="router.push({ name: 'FaqAdd' })"
        >
          <v-icon>$plus</v-icon> {{ $t("addNew") }}
        </v-btn>
      </div>
    </template>

    <DataTable
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      v-model:searches="searches"
      :headers="tableSchema.headers"
      :items="items"
      :enabled-actions="[]"
      :no-data-message="emptyMessage"
    >
      <template #item.question_header="{ item }">
        {{ item.question_header }}
      </template>
      <template #item.answer="{ item }">
        <div v-html="item.answer" />
      </template>
    </DataTable>
  </TablePageShell>
</template>

<style scoped lang="scss">
.faq-search-filters {
  width: 100%;
  min-width: 0;
}

@media (min-width: 960px) {
  .faq-search-filters {
    width: auto;
    flex: 1 1 auto;
  }
}

.faq-search-field {
  width: 100%;
  min-width: 0;
}

@media (min-width: 960px) {
  .faq-search-field:not(.faq-search-field--language) {
    width: 260px;
    max-width: 280px;
    flex: 0 0 260px;
  }

  .faq-search-field--language {
    width: 260px;
    max-width: 280px;
    flex: 0 0 260px;
  }
}

.faq-search-field--language :deep(.language-select-input) {
  width: 100%;
}
</style>
