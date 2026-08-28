<script setup lang="ts">
import {watch, ref, computed} from 'vue';
import {range} from "@/utils/arrayUtil";
import {useI18n} from "vue-i18n";
import {daysInMonth} from "@/utils/dateUtil";
import { TIME_SUFFIXES, TIME_SUFFIX_AM, TIME_SUFFIX_PM } from '@/constants/dateTimeConstant';

const { t } = useI18n()
const modelValue = defineModel<string | null>()

const props = withDefaults(
  defineProps<{
    label?: string,
    rules?: (string | ((v: any) => boolean | string))[]
  }>(),
  { rules: () => [] }
)

// ====== Data source ======
const listHours = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1, // int 1..12
  title: String(i + 1).padStart(2, '0')
}))

const listMinutes = Array.from({ length: 60 }, (_, i) => ({
  value: i, // int 0..59
  title: String(i).padStart(2, '0')
}))

const listTimeSuffixes = TIME_SUFFIXES.map(val => ({
  value: val,
  title: t(`timeSuffixes.${val}`)
}))

// ====== Models ======
const modelHour = ref<number | null>(null)
const modelMinute = ref<number | null>(null)
const modelTimeSuffix = ref<string | null>(null)

// ====== Parse incoming value ======
watch(
  modelValue,
  (val) => {
    if (!val) {
      modelHour.value = null
      modelMinute.value = null
      modelTimeSuffix.value = null
      return
    }

    const [hourStr = '0', minuteStr = '0'] = val.split(':')
    const hourNum = Number(hourStr)
    const minuteNum = Number(minuteStr)

    let displayHour = hourNum
    let suffix = TIME_SUFFIX_AM

    if (hourNum === 0) {
      displayHour = 12
      suffix = TIME_SUFFIX_AM
    } else if (hourNum === 12) {
      displayHour = 12
      suffix = TIME_SUFFIX_PM
    } else if (hourNum > 12) {
      displayHour = hourNum - 12
      suffix = TIME_SUFFIX_PM
    } else {
      displayHour = hourNum
      suffix = TIME_SUFFIX_AM
    }

    modelHour.value = displayHour
    modelMinute.value = minuteNum
    modelTimeSuffix.value = suffix
  },
  { immediate: true }
)

// ====== Emit formatted value ======
watch(
  [modelHour, modelMinute, modelTimeSuffix],
  ([h, m, s]) => {
    if (h != null && m != null && s) {
      let hour24 = h
      if (s === TIME_SUFFIX_PM && h < 12) hour24 = h + 12
      if (s === TIME_SUFFIX_AM && h === 12) hour24 = 0

      const formatted = `${String(hour24).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
      modelValue.value = formatted
    } else {
      modelValue.value = null
    }
  },
  { immediate: true }
)
</script>

<template>
  <v-input
    :label="label"
    :rules="rules"
    v-model="modelValue"
    hide-details="auto"
  >
    <div class="time-input">
      <div class="time-input__field time-input__field--hour">
        <v-autocomplete
          v-model="modelHour"
          :placeholder="$t('hour')"
          :items="listHours"
          variant="outlined"
          density="compact"
          color="primary"
          hide-details
        />
      </div>
      <div class="time-input__field time-input__field--minute">
        <v-autocomplete
          v-model="modelMinute"
          :placeholder="$t('minute')"
          :items="listMinutes"
          variant="outlined"
          density="compact"
          color="primary"
          hide-details
        />
      </div>
      <div class="time-input__field time-input__field--suffix">
        <v-autocomplete
          v-model="modelTimeSuffix"
          :items="listTimeSuffixes"
          item-title="title"
          item-value="value"
          variant="outlined"
          density="compact"
          color="primary"
          hide-details
        />
      </div>
    </div>
  </v-input>
</template>

<style scoped lang="scss">
.time-input {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: fit-content;
  max-width: 100%;
}

.time-input__field {
  flex: 0 0 88px;
  width: 88px;
  max-width: 88px;
}

.time-input__field--suffix {
  flex-basis: 96px;
  width: 96px;
  max-width: 96px;
}

.time-input__field :deep(.v-input) {
  width: 100%;
}

.time-input__field :deep(.v-field) {
  min-height: 40px;
}

.time-input__field :deep(.v-field__input) {
  min-width: 0;
}
</style>
