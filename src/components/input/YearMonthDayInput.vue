<script setup lang="ts">
import {watch, ref, computed} from 'vue';
import {range} from "@/utils/arrayUtil";
import {useI18n} from "vue-i18n";
import {daysInMonth} from "@/utils/dateUtil";

const {t} = useI18n()

const modelValue = defineModel()

// const props = defineProps({
//   name: {type: String, default: ''},
//   label: {type: String, default: ''},
//   type: {type: String, default: 'text'},
//   placeholder: {type: String, default: ''},
//   rules: {type: [String, Object, Function], default: ''},
// })

// const props = defineProps<{
//   name?: string,
//   label?: string,
//   type?: string,
//   placeholder?: string,
//   rules?: string | object | Function,
// }>()

const props = withDefaults(
  defineProps<{
    name?: string,
    label?: string,
    type?: string,
    placeholder?: string,
    rules?: (string | ((v: any) => boolean | string))[]
  }>(),
  {
    rules: () => [],
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
const minYear = currentYear - 120;
const maxYear = currentYear - 6;
const listYears = range(minYear, maxYear).reverse()

const listMonths = range(1, 12).reduce((acc, val) => {
  acc.push({
    value: val,
    title: t(`monthsShort.${val}`),
  })

  return acc;
}, []);

const listDays = computed(() => {
  if (!modelYear.value || !modelMonth.value) {
    return range(1, 31);
  }

  return range(1, daysInMonth(modelYear.value, modelMonth.value));
});

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
  }
});

</script>

<template>
  <v-input
    :label="label"
    :rules="rules"
    v-model="modelValue"
    hide-details="auto"
  >
    <div class="d-flex ga-2 w-100">
      <v-autocomplete
        v-model="modelYear"
        :placeholder="$t('common.year')"
        :items="listYears"
        variant="outlined"
      />
      <v-autocomplete
        v-model="modelMonth"
        :placeholder="$t('common.month')"
        variant="outlined"
        :items="listMonths"
        :return-object="false"
      />
      <v-autocomplete
        v-model="modelDay"
        :placeholder="$t('common.day')"
        variant="outlined"
        :items="listDays"
      />
    </div>
  </v-input>
</template>

<style scoped>

</style>
