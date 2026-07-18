<script setup lang="ts">
import { computed, ref } from "vue";

type SearchConfigItem = {
  name: string;
  label: string;
};

const props = withDefaults(
  defineProps<{
    searchesConfig?: SearchConfigItem[];
    debounceMs?: number;
    /** Compact inline search for tight headers (e.g. CardHeader) */
    inline?: boolean;
  }>(),
  {
    searchesConfig: () => [],
    debounceMs: 500,
    inline: false,
  },
);

const searches = defineModel<Array<{ key: string; value: unknown }>>("searches", {
  default: () => [],
});

const emit = defineEmits<{
  (e: "search", value: Array<{ key: string; value: unknown }>): void;
}>();

const searchModel = ref<Record<string, unknown>>({});

const searchPayload = computed(() => {
  return (props.searchesConfig ?? [])
    .filter((s) => {
      const v = searchModel.value[s.name];
      return v !== "" && v !== null && v !== undefined;
    })
    .map((s) => ({
      key: s.name,
      value: searchModel.value[s.name],
    }));
});

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    searches.value = searchPayload.value;
    emit("search", searches.value);
  }, props.debounceMs);
};
</script>

<template>
  <div
    class="table-search"
    :class="inline ? 'table-search--inline d-flex align-center' : 'd-flex flex-column flex-md-row flex-md-wrap align-stretch align-md-center ga-2'"
  >
    <template v-for="(item, idx) in searchesConfig" :key="`${item.name}-${idx}`">
      <v-text-field
        v-model="searchModel[item.name]"
        :placeholder="$t(item.label)"
        single-line
        density="compact"
        variant="outlined"
        class="table-search__field"
        hide-details
        clearable
        @update:model-value="handleSearch"
      >
        <template #prepend-inner>
          <v-icon icon="$magnify" />
        </template>
      </v-text-field>
    </template>
  </div>
</template>

<style scoped>
.table-search {
  flex: 1 1 360px;
  min-width: 260px;
}

.table-search__field {
  flex: 1 1 320px;
  min-width: 260px;
}

.table-search--inline {
  flex: 0 0 auto;
  min-width: 0;
  width: 220px;
  max-width: 100%;
}

.table-search--inline .table-search__field {
  flex: none;
  min-width: 0;
  width: 100%;
  margin: 0;
}

.table-search--inline :deep(.v-input) {
  align-items: center;
}

.table-search--inline :deep(.v-input__control),
.table-search--inline :deep(.v-field) {
  margin-block: 0;
}
</style>

