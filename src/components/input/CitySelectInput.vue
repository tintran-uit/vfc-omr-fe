<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { cityService } from "@/services/cityService";
import AddCityDialog from "./AddCityDialog.vue";

defineOptions({ inheritAttrs: false });

const modelValue = defineModel<any>();

const props = withDefaults(
  defineProps<{
    /** Nation id used to load cities from `GET /cities/country/:id`. */
    countryId?: number | string | null;
    disabled?: boolean;
    placeholder?: string;
    /** When false, hide add-new-city actions (Relating search, etc.). */
    allowAdd?: boolean;
  }>(),
  {
    countryId: null,
    disabled: false,
    allowAdd: true,
  },
);

const { t } = useI18n();
const loading = ref(false);
const searchQuery = ref("");
const addDialogOpen = ref(false);
const addDialogInitialName = ref("");
const options = ref<Array<{ id: number | string; name: string }>>([]);

const MIN_SEARCH_FOR_ADD = 2;

const hasCountry = computed(
  () => props.countryId !== null && props.countryId !== undefined && props.countryId !== "",
);

const isDisabled = computed(() => props.disabled || !hasCountry.value);

const resolvedPlaceholder = computed(() => {
  if (props.placeholder) return t(props.placeholder);
  if (!hasCountry.value) return t("church.phCitySelectCountry");
  return undefined;
});

const trimmedSearch = computed(() => searchQuery.value.trim());

const canAddFromSearch = computed(() => {
  if (!props.allowAdd) return false;
  if (!trimmedSearch.value || trimmedSearch.value.length < MIN_SEARCH_FOR_ADD) {
    return false;
  }

  const query = trimmedSearch.value.toLowerCase();
  return !options.value.some((item) => item.name.toLowerCase().includes(query));
});

async function loadCities(countryId: number | string) {
  loading.value = true;
  try {
    const items = await cityService.getAllByCountry(countryId);
    options.value = (items || []).map((c: { id: number | string; name: string }) => ({
      id: c.id,
      name: c.name,
    }));
  } catch (e) {
    console.error(e);
    options.value = [];
  } finally {
    loading.value = false;
  }
}

function openAddDialog(name = "") {
  addDialogInitialName.value = name.trim();
  addDialogOpen.value = true;
}

function onCityCreated(city: { id: number | string; name: string }) {
  const exists = options.value.some((item) => String(item.id) === String(city.id));

  if (!exists) {
    options.value = [...options.value, city].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  modelValue.value = city.id;
  searchQuery.value = "";
}

watch(
  () => props.countryId,
  async (countryId, prev) => {
    const hadCountryBefore =
      prev !== undefined && prev !== null && prev !== "";

    if (!hasCountry.value) {
      options.value = [];
      searchQuery.value = "";
      if (hadCountryBefore && modelValue.value != null && modelValue.value !== "") {
        modelValue.value = null;
      }
      return;
    }

    await loadCities(countryId as number | string);

    if (hadCountryBefore && String(prev) !== String(countryId)) {
      modelValue.value = null;
      searchQuery.value = "";
      return;
    }

    if (modelValue.value != null && modelValue.value !== "") {
      const exists = options.value.some(
        (item) => String(item.id) === String(modelValue.value),
      );
      if (!exists) modelValue.value = null;
    }
  },
  { immediate: true },
);
</script>

<template>
  <v-autocomplete
    :items="options"
    color="primary"
    variant="outlined"
    density="compact"
    item-value="id"
    item-title="name"
    v-model="modelValue"
    v-model:search="searchQuery"
    :loading="loading"
    :disabled="isDisabled"
    :placeholder="resolvedPlaceholder"
    :clearable="true"
    location="bottom"
    position-strategy="connected"
    scroll-strategy="close"
    v-bind="$attrs"
  >
    <template #no-data>
      <v-list-item
        v-if="canAddFromSearch"
        density="compact"
        @mousedown.prevent
        @click="openAddDialog(trimmedSearch)"
      >
        <template #prepend>
          <v-icon
            icon="$plus"
            size="18"
            color="primary"
          />
        </template>
        <v-list-item-title class="text-primary">
          {{ $t("city.addNamed", { name: trimmedSearch }) }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        v-else
        density="compact"
      >
        <v-list-item-title class="text-medium-emphasis">
          {{
            trimmedSearch
              ? $t("city.noResults", { name: trimmedSearch })
              : $t("noData")
          }}
        </v-list-item-title>
      </v-list-item>
    </template>

    <template #append-item>
      <template v-if="allowAdd">
        <v-divider class="mt-1" />
        <v-list-item
          density="compact"
          @mousedown.prevent
          @click="openAddDialog(trimmedSearch)"
        >
          <template #prepend>
            <v-icon
              icon="$plus"
              size="18"
              color="primary"
            />
          </template>
          <v-list-item-title class="text-primary">
            {{ $t("city.addNew") }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </template>
  </v-autocomplete>

  <AddCityDialog
    v-if="hasCountry && allowAdd"
    v-model="addDialogOpen"
    :country-id="countryId!"
    :initial-name="addDialogInitialName"
    @created="onCityCreated"
  />
</template>

<style scoped lang="scss"></style>
