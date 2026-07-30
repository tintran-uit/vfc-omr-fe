<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { cityService } from "@/services/cityService";
import SelectInput from "./SelectInput.vue";

const modelValue = defineModel<any>();

const props = withDefaults(
  defineProps<{
    /** Nation id used to load cities from `GET /cities/country/:id`. */
    countryId?: number | string | null;
    disabled?: boolean;
    placeholder?: string;
  }>(),
  {
    countryId: null,
    disabled: false,
  },
);

const { t } = useI18n();
const loading = ref(false);
const options = ref<Array<{ id: number | string; name: string }>>([]);

const hasCountry = computed(
  () => props.countryId !== null && props.countryId !== undefined && props.countryId !== "",
);

const isDisabled = computed(() => props.disabled || !hasCountry.value);

const resolvedPlaceholder = computed(() => {
  if (props.placeholder) return t(props.placeholder);
  if (!hasCountry.value) return t("church.phCitySelectCountry");
  return undefined;
});

async function loadCities(countryId: number | string) {
  loading.value = true;
  try {
    const items = await cityService.getAllByCountry(countryId);
    options.value = (items || []).map((c: any) => ({
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

watch(
  () => props.countryId,
  async (countryId, prev) => {
    const hadCountryBefore =
      prev !== undefined && prev !== null && prev !== "";

    if (!hasCountry.value) {
      options.value = [];
      // User cleared nation → drop city. Skip on first mount / hydrate.
      if (hadCountryBefore && modelValue.value != null && modelValue.value !== "") {
        modelValue.value = null;
      }
      return;
    }

    await loadCities(countryId as number | string);

    // Only reset city when the user changes nation — not on first bind
    // (edit/clone hydrate country then city from null → id).
    if (hadCountryBefore && String(prev) !== String(countryId)) {
      modelValue.value = null;
      return;
    }

    // Keep city only if it still belongs to this nation's list.
    if (modelValue.value != null && modelValue.value !== "") {
      const exists = options.value.some((o) => String(o.id) === String(modelValue.value));
      if (!exists) modelValue.value = null;
    }
  },
  { immediate: true },
);
</script>

<template>
  <SelectInput
    :items="options"
    v-model="modelValue"
    v-bind="$attrs"
    item-value="id"
    item-title="name"
    :loading="loading"
    :disabled="isDisabled"
    :placeholder="resolvedPlaceholder"
  />
</template>

<style scoped lang="scss"></style>
