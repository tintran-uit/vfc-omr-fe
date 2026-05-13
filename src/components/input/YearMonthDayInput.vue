<script setup lang="ts">
import {watch, ref, computed} from 'vue';
import {range} from "@/utils/arrayUtil";
import {useI18n} from "vue-i18n";
import {daysInMonth} from "@/utils/dateUtil";

const {t} = useI18n()

const modelValue = defineModel()

const props = withDefaults(
  defineProps<{
    name?: string,
    label?: string,
    type?: string,
    placeholder?: string,
    rules?: (string | ((v: any) => boolean | string))[],
    mode?: 'past' | 'future' | 'range'
    minYear?: Number
    maxYear?: Number
    /** default: Year-Month-Day in one row; monthTop: Month on first row, Day+Year on second row */
    layout?: 'default' | 'monthTop'
    density?: 'default' | 'comfortable' | 'compact'
    /** When true, render only the Y/M/D fields (no outer v-input). Parent supplies validation wrapper. */
    embedded?: boolean
    /** When true (default layout), stack Year / Month / Day vertically full width */
    stacked?: boolean
  }>(),
  {
    rules: () => [],
    mode: 'past',
    layout: 'default',
    density: 'comfortable',
    embedded: false,
    stacked: false,
  }
)

// const emit = defineEmits<{
//   (e: 'update:modelValue', value: string): void
// }>()


// Models
const modelYear = ref<number | null>(null);
const modelMonth = ref<number | null>(null);
const modelDay = ref<number | null>(null);


const currentYear = new Date().getFullYear();

// ✅ Tính range năm theo mode
const listYears = computed(() => {
  let minYear, maxYear, years

  switch (props.mode) {
    case 'future':
      minYear = currentYear
      maxYear = currentYear + 120
      years = range(minYear, maxYear) // tăng dần (2025 → 2145)
      break
    case 'range':
      minYear = props.minYear ?? currentYear - 120
      maxYear = props.maxYear ?? currentYear + 120
      // Newest / highest year first (e.g. church planting projection date fields)
      years = range(minYear, maxYear).reverse()
      break
    case 'past':
    default:
      minYear = currentYear - 120
      maxYear = currentYear
      years = range(minYear, maxYear).reverse() // giảm dần (2024 → 1904)
      break
  }

  return years
})

// ✅ Tháng
const listMonths = range(1, 12).map((val) => ({
  value: val,
  title: t(`monthsShort.${val}`),
}))

// ✅ Ngày
const listDays = computed(() => {
  if (!modelYear.value || !modelMonth.value) {
    return range(1, 31)
  }

  return range(1, daysInMonth(modelYear.value, modelMonth.value))
})
// const minYear = currentYear - 120;
// const maxYear = currentYear - 6;
// const listYears = range(minYear, maxYear).reverse()

// const listMonths = range(1, 12).reduce((acc, val) => {
//   acc.push({
//     value: val,
//     title: t(`monthsShort.${val}`),
//   })

//   return acc;
// }, []);

// const listDays = computed(() => {
//   if (!modelYear.value || !modelMonth.value) {
//     return range(1, 31);
//   }

//   return range(1, daysInMonth(modelYear.value, modelMonth.value));
// });

watch(
  modelValue,
  (newVal) => {
    if (!newVal) {
      return;
    }

    const date = new Date(newVal);

    if (!isNaN(date.getTime())) {
      modelYear.value = date.getFullYear();
      modelMonth.value = date.getMonth() + 1;
      modelDay.value = date.getDate();
    }
  },
  {immediate: true}
);

watch([modelYear, modelMonth, modelDay], ([newYear, newMonth, newDay]) => {
  if (newYear && newMonth && newDay) {
    modelValue.value = `${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`;
  } else {
    modelValue.value = null;
  }
});

</script>

<template>
  <v-input
    v-if="!props.embedded"
    :label="label"
    :rules="rules"
    v-model="modelValue"
    hide-details="auto"
  >
    <div v-if="props.layout === 'monthTop'" class="w-100 ymd-monthTop">
      <div class="ymd-monthTop__month">
        <v-autocomplete
          v-model="modelMonth"
          :placeholder="$t('month')"
          variant="outlined"
          :items="listMonths"
          :return-object="false"
          :density="props.density"
          hide-details
        />
      </div>
      <div class="d-flex ga-2 ymd-monthTop__dayYear">
        <v-autocomplete
          v-model="modelDay"
          :placeholder="$t('day')"
          variant="outlined"
          :items="listDays"
          :density="props.density"
          hide-details
        />
        <v-autocomplete
          v-model="modelYear"
          :placeholder="$t('year')"
          :items="listYears"
          variant="outlined"
          :density="props.density"
          hide-details
        />
      </div>
    </div>
    <div
      v-else
      :class="props.stacked ? 'd-flex flex-column ga-2 w-100' : 'd-flex ga-2 w-100'"
    >
      <v-autocomplete
        v-model="modelYear"
        :class="props.stacked ? 'w-100' : undefined"
        :placeholder="$t('year')"
        :items="listYears"
        variant="outlined"
        :density="props.density"
        hide-details
      />
      <v-autocomplete
        v-model="modelMonth"
        :class="props.stacked ? 'w-100' : undefined"
        :placeholder="$t('month')"
        variant="outlined"
        :items="listMonths"
        :return-object="false"
        :density="props.density"
        hide-details
      />
      <v-autocomplete
        v-model="modelDay"
        :class="props.stacked ? 'w-100' : undefined"
        :placeholder="$t('day')"
        variant="outlined"
        :items="listDays"
        :density="props.density"
        hide-details
      />
    </div>
  </v-input>
  <div v-else-if="props.layout === 'monthTop'" class="w-100 ymd-monthTop">
    <div class="ymd-monthTop__month">
      <v-autocomplete
        v-model="modelMonth"
        :placeholder="$t('month')"
        variant="outlined"
        :items="listMonths"
        :return-object="false"
        :density="props.density"
        hide-details
      />
    </div>
    <div class="d-flex ga-2 ymd-monthTop__dayYear">
      <v-autocomplete
        v-model="modelDay"
        :placeholder="$t('day')"
        variant="outlined"
        :items="listDays"
        :density="props.density"
        hide-details
      />
      <v-autocomplete
        v-model="modelYear"
        :placeholder="$t('year')"
        :items="listYears"
        variant="outlined"
        :density="props.density"
        hide-details
      />
    </div>
  </div>
  <div
    v-else
    :class="props.stacked ? 'd-flex flex-column ga-2 w-100' : 'd-flex ga-2 w-100'"
  >
    <v-autocomplete
      v-model="modelYear"
      :class="props.stacked ? 'w-100' : undefined"
      :placeholder="$t('year')"
      :items="listYears"
      variant="outlined"
      :density="props.density"
      hide-details
    />
    <v-autocomplete
      v-model="modelMonth"
      :class="props.stacked ? 'w-100' : undefined"
      :placeholder="$t('month')"
      variant="outlined"
      :items="listMonths"
      :return-object="false"
      :density="props.density"
      hide-details
    />
    <v-autocomplete
      v-model="modelDay"
      :class="props.stacked ? 'w-100' : undefined"
      :placeholder="$t('day')"
      variant="outlined"
      :items="listDays"
      :density="props.density"
      hide-details
    />
  </div>
</template>

<style scoped>
.ymd-monthTop__month {
  margin-bottom: 4px;
}

/* Fix vertical alignment in outlined fields */
:deep(.v-field__input) {
  align-items: center;
  display: flex;
}

/* Vuetify outlined fields may keep extra top padding for floating labels.
   This component uses placeholders, so remove the padding to keep text centered. */
:deep(.v-field--variant-outlined .v-field__input) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
