<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { userService } from "@/services/userService";

type UserId = string | number;
type UserOption = { id: UserId; name: string };

const modelValue = defineModel<UserId | null>();

const props = withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    clearable?: boolean;
    hideDetails?: boolean | "auto";
    rules?: ((v: any) => boolean | string)[];
  }>(),
  {
    clearable: true,
    rules: () => [],
  },
);

const { t } = useI18n();

const items = ref<UserOption[]>([]);
const loading = ref(false);
const searchQuery = ref("");
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const resolvedLabel = computed(() => (props.label ? t(props.label) : ""));
const translatedPlaceholder = computed(() => (props.placeholder ? t(props.placeholder) : ""));

const mergeItems = (incoming: UserOption[]) => {
  const merged = new Map(items.value.map((item) => [String(item.id), item]));
  incoming.forEach((item) => merged.set(String(item.id), item));
  items.value = Array.from(merged.values());
};

const fetchItems = async (name = "") => {
  loading.value = true;
  try {
    const params: Record<string, unknown> = { limit: 25, page: 1 };
    if (name) params.name = name;

    const data = await userService.getList(params);
    mergeItems((data?.items || []).map((item: any) => ({ id: item.id, name: item.name })));
  } catch (e) {
    console.error("Error fetching users:", e);
  } finally {
    loading.value = false;
  }
};

const fetchItem = async (id: UserId) => {
  try {
    const data = await userService.get(id, false);
    if (data) mergeItems([{ id: data.id, name: data.name }]);
  } catch (e) {
    console.error("Error fetching user by id:", e);
  }
};

function onSearch(query: string) {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchItems((query || "").trim()), 400);
}

onMounted(() => fetchItems());

watch(
  () => modelValue.value,
  (id) => {
    if (id) fetchItem(id);
  },
  { immediate: true },
);
</script>

<template>
  <v-label
    v-if="label"
    class="text-wrap"
  >
    {{ resolvedLabel }}
  </v-label>
  <v-autocomplete
    v-model="modelValue"
    v-model:search="searchQuery"
    :items="items"
    color="primary"
    variant="outlined"
    density="compact"
    item-title="name"
    item-value="id"
    :loading="loading"
    :hide-no-data="loading"
    :placeholder="translatedPlaceholder"
    :no-data-text="$t('noData')"
    :clearable="clearable"
    :hide-details="hideDetails"
    :rules="rules"
    no-filter
    @update:search="onSearch"
  />
</template>
