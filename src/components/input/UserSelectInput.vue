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
const loadingMore = ref(false);
const page = ref(1);
const itemsPerPage = 25;
const searchQuery = ref("");
const noMoreItems = ref(false);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
let isSelecting = false;
let selectedItem: UserOption | null = null;

const resolvedLabel = computed(() => (props.label ? t(props.label) : ""));
const translatedPlaceholder = computed(() => (props.placeholder ? t(props.placeholder) : ""));

const fetchItems = async (reset = false) => {
  if (reset) {
    page.value = 1;
    items.value = [];
    noMoreItems.value = false;
  }

  if (noMoreItems.value) return;

  loading.value = page.value === 1;
  loadingMore.value = page.value > 1;

  try {
    const params: { limit: number; page: number; name?: string } = {
      limit: itemsPerPage,
      page: page.value,
    };

    if (searchQuery.value) {
      params.name = searchQuery.value;
    }

    const data = await userService.getList(params, false);

    noMoreItems.value = !data.has_next;

    const newItems = (data.items || []).map((item: any) => ({
      id: item.id,
      name: item.name,
    }));

    const merged = [...items.value, ...newItems];
    const unique = merged.filter(
      (item, index, self) => index === self.findIndex((entry) => entry.id === item.id),
    );

    items.value = unique;

    if (selectedItem && !items.value.find((item) => item.id === selectedItem!.id)) {
      items.value.push(selectedItem);
    }

    page.value++;
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const fetchItem = async (id: UserId) => {
  try {
    const data = await userService.get(id, false);
    if (data) {
      selectedItem = { id: data.id, name: data.name };

      if (!items.value.find((item) => item.id === selectedItem!.id)) {
        items.value.push(selectedItem);
      }
    }
  } catch (error) {
    console.error("Error fetching user by id:", error);
  }
};

const onFocus = () => {
  if (items.value.length === 0) {
    fetchItems();
  }
};

function onSearch(query: string) {
  if (isSelecting) return;

  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    fetchItems(true);
  }, 400);
}

function onUpdateModelValue(value: UserId | null) {
  isSelecting = true;
  selectedItem = items.value.find((item) => item.id === value) || null;
  setTimeout(() => {
    isSelecting = false;
  }, 0);
}

function onIntersect(isIntersecting: boolean) {
  if (!isIntersecting) return;
  if (loadingMore.value || noMoreItems.value) return;

  fetchItems();
}

onMounted(() => {
  fetchItems();
});

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
    @focus="onFocus"
    @update:search="onSearch"
    @update:model-value="onUpdateModelValue"
  >
    <template #append-item>
      <div
        v-intersect="onIntersect"
        class="text-center py-2"
      >
        <v-progress-circular
          v-if="loadingMore"
          indeterminate
          color="primary"
        />
      </div>
    </template>
  </v-autocomplete>
</template>
