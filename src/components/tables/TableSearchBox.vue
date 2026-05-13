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
  }>(),
  {
    searchesConfig: () => [],
    debounceMs: 500,
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
  <div class="table-search d-flex flex-column flex-md-row flex-md-wrap align-stretch align-md-center ga-2">
    <template v-for="(item, idx) in searchesConfig" :key="`${item.name}-${idx}`">
      <v-text-field
        v-model="searchModel[item.name]"
        :placeholder="$t(item.label)"
        single-line
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
  flex: 1 1 360px; /* don't shrink to tiny width */
  min-width: 260px;
}

.table-search__field {
  flex: 1 1 320px;
  min-width: 260px;
}
</style>

