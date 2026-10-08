<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import SelectInput from "@/components/input/SelectInput.vue";
import { useGenerateReport } from "@/composables/useGenerateReport";
import { useChurchRegionStore } from "@/stores/churchRegionStore";
import { useCountryStore } from "@/stores/countryStore";
import { useGeographicalRegionStore } from "@/stores/geographicalRegionStore";
import { languageRegionService } from "@/services/languageRegionService";

defineOptions({ name: "GenerateReportMultiChurch" });

const VISIT_REPORT_TYPE = "12_months_visits_events_monthly_multi_church";

const REPORTS = [
  {
    id: VISIT_REPORT_TYPE,
    code: "[# 21]",
    hintKey: "generateReport.typeHints.monthlyData",
  },
  {
    id: "mail_merge_report",
    code: "[# 29]",
    hintKey: "generateReport.typeHints.churches",
  },
  {
    id: "disabled_churches_report",
    code: "[# 31]",
    hintKey: "generateReport.typeHints.churches",
  },
] as const;

const { t, te } = useI18n();
const geographicalRegionStore = useGeographicalRegionStore();
const churchRegionStore = useChurchRegionStore();
const countryStore = useCountryStore();

const { reportTypeOptions, errorMessage, submitting, loadingFormData, generate } =
  useGenerateReport("multi_church");

const formRef = ref();
const geographicalRegionIds = ref<number[]>([]);
const churchRegionIds = ref<number[]>([]);
const languageRegionIds = ref<number[]>([]);
const countryIds = ref<number[]>([]);
const languageRegions = ref<any[]>([]);
const reportType = ref<string | null>(null);
const year = ref<number | null>(new Date().getFullYear());

const geographicalRegions = computed(() => geographicalRegionStore.asyncOptions);
const churchRegions = computed(() => churchRegionStore.asyncOptions);
const countries = computed(() => countryStore.asyncOptions);
const showsYear = computed(() => reportType.value === VISIT_REPORT_TYPE);

const reportMeta = Object.fromEntries(REPORTS.map((report) => [report.id, report]));

const options = computed(() => {
  const source = reportTypeOptions.value.length
    ? reportTypeOptions.value
    : REPORTS.map((report) => {
        const key = `generateReport.types.${report.id}`;
        return { id: report.id, name: te(key) ? t(key) : report.id };
      });

  return source.map((option) => {
    const meta = reportMeta[option.id];
    return {
      ...option,
      code: meta?.code ?? "",
      hint: meta && te(meta.hintKey) ? t(meta.hintKey) : "",
    };
  });
});

const required = (field: string) => (v: unknown) =>
  (v !== null && v !== undefined && v !== "") || t("validation.required", { field });

watch(
  options,
  (items) => {
    if (reportType.value && items.some((option) => option.id === reportType.value)) return;
    reportType.value = items[0]?.id ?? null;
  },
  { immediate: true },
);

onMounted(async () => {
  try {
    languageRegions.value = (await languageRegionService.getAll()) || [];
  } catch (e) {
    console.error("Failed to load language regions:", e);
  }
});

function onYearInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value.trim();
  if (!raw) {
    year.value = null;
    return;
  }

  const parsed = Number(raw);
  year.value = Number.isFinite(parsed) ? parsed : null;
}

function stepYear(delta: number) {
  if (year.value == null) {
    year.value = new Date().getFullYear();
    return;
  }

  year.value += delta;
}

const onSubmit = async () => {
  const { valid } = (await formRef.value?.validate()) ?? { valid: true };
  if (!valid || !reportType.value) return;

  const payload: Record<string, unknown> = {
    geographical_region_ids: geographicalRegionIds.value,
    church_region_ids: churchRegionIds.value,
    language_region_ids: languageRegionIds.value,
    report_type: reportType.value,
  };

  if (showsYear.value) {
    payload.end_year = Number(year.value);
  } else {
    payload.country_ids = countryIds.value;
  }

  await generate("multiChurch", payload, `${reportType.value}.pdf`);
};
</script>

<template>
  <div class="multi-church">
    <v-row class="my-2">
      <v-col
        cols="12"
        md="6"
        class="d-flex align-center"
      >
        <div class="text-h4 font-weight-medium">
          {{ $t("mainMenu.generateReports") }}
        </div>
      </v-col>
    </v-row>

    <v-card
      class="multi-church__card"
      variant="outlined"
      rounded="0"
      elevation="0"
    >
      <div class="multi-church__panel">
        <svg
          class="multi-church__icon"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <rect
            x="1"
            y="1"
            width="14"
            height="14"
            rx="1"
            fill="#fff"
            stroke="#66bb6a"
          />
          <rect
            x="1.5"
            y="1.5"
            width="13"
            height="3.5"
            fill="#42a5f5"
          />
          <path
            d="M1.5 8h13M1.5 11.5h13M6 5v9.5M10.5 5v9.5"
            stroke="#66bb6a"
            stroke-width="0.7"
          />
        </svg>
        <span>{{ $t("generateReport.multiChurchTitle") }}</span>
      </div>

      <v-form
        ref="formRef"
        @submit.prevent="onSubmit"
      >
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="ma-4 mb-0"
        >
          {{ errorMessage }}
        </v-alert>

        <div class="multi-church__row">
          <div class="multi-church__label">
            {{ $t("generateReport.labelGeographicalRegions") }}
          </div>
          <SelectInput
            v-model="geographicalRegionIds"
            class="multi-church__select"
            :items="geographicalRegions"
            item-title="name"
            item-value="id"
            multiple
            :placeholder="$t('generateReport.labelGeographicalRegions')"
            :clearable="false"
            hide-details="auto"
          />
        </div>

        <div class="multi-church__row">
          <div class="multi-church__label">
            {{ $t("generateReport.labelChurchRegions") }}
          </div>
          <SelectInput
            v-model="churchRegionIds"
            class="multi-church__select"
            :items="churchRegions"
            item-title="name"
            item-value="id"
            multiple
            :placeholder="$t('generateReport.labelChurchRegions')"
            :clearable="false"
            hide-details="auto"
          />
        </div>

        <div class="multi-church__row">
          <div class="multi-church__label">
            {{ $t("generateReport.labelLanguageRegions") }}
          </div>
          <SelectInput
            v-model="languageRegionIds"
            class="multi-church__select"
            :items="languageRegions"
            item-title="name"
            item-value="id"
            multiple
            :placeholder="$t('generateReport.labelLanguageRegions')"
            :clearable="false"
            hide-details="auto"
          />
        </div>

        <template v-if="showsYear">
          <div
            key="visit-year"
            class="multi-church__row"
          >
            <div class="multi-church__label">
              {{ $t("generateReport.labelReportBackFrom") }}
            </div>
            <v-input
              :model-value="year"
              class="multi-church__year"
              :rules="[required($t('generateReport.labelReportBackFrom'))]"
              hide-details="auto"
            >
              <div class="year-stepper">
                <input
                  class="year-stepper__value"
                  inputmode="numeric"
                  :value="year ?? ''"
                  :aria-label="$t('generateReport.labelReportBackFrom')"
                  @input="onYearInput"
                />
                <button
                  v-if="year != null"
                  type="button"
                  class="year-stepper__clear"
                  :aria-label="$t('generateReport.labelReportBackFrom')"
                  @click="year = null"
                >
                  ×
                </button>
                <div class="year-stepper__spin">
                  <button
                    type="button"
                    :aria-label="$t('generateReport.labelReportBackFrom')"
                    @click="stepYear(1)"
                  >
                    <span class="year-stepper__caret year-stepper__caret--up" />
                  </button>
                  <button
                    type="button"
                    :aria-label="$t('generateReport.labelReportBackFrom')"
                    @click="stepYear(-1)"
                  >
                    <span class="year-stepper__caret year-stepper__caret--down" />
                  </button>
                </div>
              </div>
            </v-input>
          </div>

          <p
            v-if="year"
            key="visit-hint"
            class="multi-church__hint"
          >
            {{ $t("generateReport.multiChurchYearHint", { year }) }}
          </p>
        </template>

        <div
          v-else
          key="countries"
          class="multi-church__row"
        >
          <div class="multi-church__label">
            {{ $t("mainMenu.countries") }}
          </div>
          <SelectInput
            v-model="countryIds"
            class="multi-church__select"
            :items="countries"
            item-title="name"
            item-value="id"
            multiple
            :placeholder="$t('mainMenu.countries')"
            :clearable="false"
            hide-details="auto"
          />
        </div>

        <div class="multi-church__row">
          <div class="multi-church__label">
            {{ $t("generateReport.multiChurchTitle") }}
          </div>
          <v-input
            :model-value="reportType"
            class="multi-church__types"
            :rules="[required($t('generateReport.multiChurchTitle'))]"
            hide-details="auto"
          >
            <div class="multi-church__options">
              <label
                v-for="option in options"
                :key="option.id"
                class="multi-option"
                @click="reportType = option.id"
              >
                <input
                  type="radio"
                  name="multi-church-report"
                  :value="option.id"
                  :checked="reportType === option.id"
                  @change="reportType = option.id"
                />
                <span>{{ option.name }}</span>
                <span
                  v-if="option.code"
                  class="multi-option__code"
                >
                  {{ option.code }}
                </span>
                <span
                  v-if="option.hint"
                  class="multi-option__hint"
                >
                  ({{ option.hint }})
                </span>
              </label>
            </div>
          </v-input>
        </div>

        <div class="multi-church__actions">
          <v-btn
            color="primary"
            type="submit"
            class="multi-church__generate"
            :loading="submitting"
            :disabled="loadingFormData"
          >
            {{ $t("generateReport.generateShort") }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.multi-church__card {
  border-color: #d9d9d9;
  background: #fff;
}

.multi-church__panel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f7f7f7;
  border-bottom: 1px solid #e4e4e4;
  color: #333;
  font-size: 0.95rem;
  font-weight: 600;
}

.multi-church__icon {
  display: block;
  flex: 0 0 auto;
}

.multi-church__row {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: 12px 24px;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e4e4;
}

.multi-church__label {
  color: #3a3a3a;
  font-size: 0.875rem;
  line-height: 1.3;
}

.multi-church__select,
.multi-church__year {
  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.multi-church__year {
  :deep(.v-input__control) {
    display: flex;
  }
}

.multi-church__year.v-input--error .year-stepper {
  border-color: rgb(var(--v-theme-error));
}

.year-stepper {
  display: inline-flex;
  align-items: stretch;
  width: 148px;
  height: 32px;
  border: 1px solid #c5c5c5;
  border-radius: 2px;
  background: #fff;
  overflow: hidden;
}

.year-stepper__value {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  padding: 0 4px 0 8px;
  background: transparent;
  color: #222;
  font-size: 0.875rem;
}

.year-stepper__clear {
  border: 0;
  background: transparent;
  color: #8a8a8a;
  padding: 0 4px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.year-stepper__spin {
  display: flex;
  flex-direction: column;
  width: 18px;
  border-left: 1px solid #c5c5c5;
}

.year-stepper__spin button {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  border: 0;
  background: #f3f3f3;
  padding: 0;
  cursor: pointer;
}

.year-stepper__spin button + button {
  border-top: 1px solid #d0d0d0;
}

.year-stepper__caret {
  width: 0;
  height: 0;
  border-left: 3.5px solid transparent;
  border-right: 3.5px solid transparent;
}

.year-stepper__caret--up {
  border-bottom: 4px solid #666;
}

.year-stepper__caret--down {
  border-top: 4px solid #666;
}

.multi-church__hint {
  margin: 0;
  padding: 14px 16px;
  border-bottom: 1px solid #e4e4e4;
  color: #1f9d3a;
  font-size: 0.875rem;
  line-height: 1.45;
}

.multi-church__types {
  :deep(.v-input__control) {
    display: block;
  }

  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.multi-church__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.multi-option {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  min-height: 24px;
  color: #333;
  font-size: 0.875rem;
  line-height: 1.3;
  cursor: pointer;
}

.multi-option input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #757575;
  cursor: pointer;
}

.multi-option__code {
  color: #1f9d3a;
  white-space: nowrap;
}

.multi-option__hint {
  color: #8a8a8a;
  white-space: nowrap;
}

.multi-church__actions {
  display: flex;
  justify-content: flex-end;
  padding: 28px 16px 16px;
}

.multi-church__generate {
  min-width: 118px;
  letter-spacing: 0.04em;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 3px;
}

@media (max-width: 767px) {
  .multi-church__row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
