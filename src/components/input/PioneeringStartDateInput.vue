<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import YearMonthDayInput from '@/components/input/YearMonthDayInput.vue';

const modelValue = defineModel<string | null>();

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    preparationDate?: string | null;
    rules?: (string | ((v: unknown) => boolean | string))[];
    id?: string;
  }>(),
  {
    preparationDate: null,
    rules: () => [],
  },
);

type Mode = 'relative_6m' | 'specific';
const mode = ref<Mode>('relative_6m');

const maxYear = new Date().getFullYear() + 5;

function addSixMonthsIso(ymd: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(ymd).trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  dt.setMonth(dt.getMonth() + 6);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

const computedFromPreparation = computed(() => {
  if (!props.preparationDate) return null;
  return addSixMonthsIso(props.preparationDate);
});

watch(
  () => [props.preparationDate, mode.value, computedFromPreparation.value] as const,
  () => {
    if (mode.value === 'relative_6m') {
      modelValue.value = computedFromPreparation.value;
    }
  },
  { immediate: true },
);

watch(mode, (next, prev) => {
  if (next === 'relative_6m') {
    modelValue.value = computedFromPreparation.value;
    return;
  }
  if (next === 'specific' && prev === 'relative_6m') {
    modelValue.value = computedFromPreparation.value;
  }
});
</script>

<template>
  <v-input
    :id="id"
    :rules="rules"
    v-model="modelValue"
    hide-details="auto"
  >
    <!-- v-input default slot lays out multiple roots in a row; column wrapper stacks radios + date row -->
    <div class="d-flex flex-column w-100 ga-2">
      <v-radio-group
        v-model="mode"
        hide-details
        density="comfortable"
        column
      >
        <v-radio
          color="primary"
          value="relative_6m"
          :label="t('churchPlantingProjection.pioneeringDateOptionSixMonthsAfterPreparation')"
        />
        <v-radio
          color="primary"
          value="specific"
          :label="t('churchPlantingProjection.pioneeringDateOptionSpecificDate')"
        />
      </v-radio-group>

      <YearMonthDayInput
        v-if="mode === 'specific'"
        v-model="modelValue"
        embedded
        mode="range"
        :min-year="1990"
        :max-year="maxYear"
        density="compact"
        :rules="[]"
      />
    </div>
  </v-input>
</template>
