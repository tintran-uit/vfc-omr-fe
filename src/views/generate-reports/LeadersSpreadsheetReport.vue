<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import SelectInput from "@/components/input/SelectInput.vue";
import UserSelectInput from "@/components/input/UserSelectInput.vue";
import { useGenerateReport } from "@/composables/useGenerateReport";
import { useGeographicalRegionStore } from "@/stores/geographicalRegionStore";

defineOptions({ name: "GenerateReportLeadersSpreadsheet" });

const REPORTS = [
  {
    id: "24_months_visits",
    code: "[# 20]",
    hintKey: "generateReport.typeHints.monthlyData",
    nameKey: "generateReport.leaderSheetTwoYearVisits",
  },
  {
    id: "12_months_church_planting",
    code: "[# 28]",
    hintKey: "generateReport.typeHints.yearlyData",
    nameKey: "generateReport.leaderSheetPlantingA3",
  },
  {
    id: "12_months_church_planting_a4",
    code: "[# 39]",
    hintKey: "generateReport.typeHints.yearlyData",
    nameKey: "generateReport.leaderSheetPlantingA4",
  },
  {
    id: "leader_credentials_report",
    code: "[# 30]",
    hintKey: "",
    nameKey: "generateReport.leaderSheetCredentials",
  },
  {
    id: "picture_church_pastor",
    code: "[# 32]",
    hintKey: "generateReport.typeHints.latestData",
    nameKey: "generateReport.leaderSheetPictures",
  },
  {
    id: "36_months_projections",
    code: "[# 34]",
    hintKey: "",
    nameKey: "generateReport.leaderSheetProjections",
  },
  {
    id: "36_months_projections_only",
    code: "[# 35]",
    hintKey: "",
    nameKey: "generateReport.leaderSheetProjectionsOnly",
  },
] as const;

const { t, te } = useI18n();
const geographicalRegionStore = useGeographicalRegionStore();

const { reportTypeOptions, errorMessage, submitting, loadingFormData, generate } =
  useGenerateReport("user_data");

const formRef = ref();
const userId = ref<number | string | null>(null);
const geographicalRegionId = ref<number | null>(null);
const reportType = ref<string | null>(null);
const year = ref<number | null>(new Date().getFullYear());
const showGeoScope = ref(false);

const geographicalRegions = computed(() => geographicalRegionStore.asyncOptions);
const reportMeta = Object.fromEntries(REPORTS.map((report) => [report.id, report]));

const options = computed(() => {
  const source = reportTypeOptions.value.length
    ? reportTypeOptions.value
    : REPORTS.map((report) => ({
        id: report.id,
        name: te(report.nameKey) ? t(report.nameKey) : report.id,
      }));

  return source.map((option) => {
    const meta = reportMeta[option.id];
    const nameKey = meta?.nameKey;
    return {
      ...option,
      name: nameKey && te(nameKey) ? t(nameKey) : option.name,
      code: meta?.code ?? "",
      hint: meta?.hintKey && te(meta.hintKey) ? t(meta.hintKey) : "",
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

watch(showGeoScope, (open) => {
  if (!open) geographicalRegionId.value = null;
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

  await generate(
    "userData",
    {
      user_id: userId.value,
      geographical_region_id: showGeoScope.value ? geographicalRegionId.value : null,
      end_year: Number(year.value),
      report_type: reportType.value,
    },
    `${reportType.value}.pdf`,
  );
};
</script>

<template>
  <div class="leader-sheet">
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
      class="leader-sheet__card"
      variant="outlined"
      rounded="0"
      elevation="0"
    >
      <div class="leader-sheet__panel">
        <svg
          class="leader-sheet__icon"
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
        <span>{{ $t("generateReport.leadersDataReports") }}</span>
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

        <div class="leader-sheet__row">
          <div>
            <div class="leader-sheet__label">
              {{ $t("generateReport.labelUser") }}
            </div>
            <button
              type="button"
              class="leader-sheet__scope"
              @click="showGeoScope = !showGeoScope"
            >
              {{ showGeoScope ? "−" : "+" }}
              {{
                $t(
                  showGeoScope
                    ? "generateReport.hideGeographicScope"
                    : "generateReport.limitGeographicScope",
                )
              }}
            </button>
          </div>
          <UserSelectInput
            v-model="userId"
            class="leader-sheet__user"
            placeholder="generateReport.selectALeader"
            :clearable="false"
            hide-details="auto"
            :rules="[required($t('generateReport.labelUser'))]"
          />
        </div>

        <div
          v-if="showGeoScope"
          class="leader-sheet__row"
        >
          <div class="leader-sheet__label">
            {{ $t("generateReport.labelGeographicalRegion") }}
          </div>
          <SelectInput
            v-model="geographicalRegionId"
            class="leader-sheet__region"
            :items="geographicalRegions"
            item-title="name"
            item-value="id"
            :clearable="false"
            hide-details="auto"
          />
        </div>

        <div class="leader-sheet__row">
          <div class="leader-sheet__label">
            {{ $t("generateReport.labelReportBackFromYear") }}
          </div>
          <v-input
            :model-value="year"
            class="leader-sheet__year"
            :rules="[required($t('generateReport.labelReportBackFromYear'))]"
            hide-details="auto"
          >
            <div class="year-stepper">
              <input
                class="year-stepper__value"
                inputmode="numeric"
                :value="year ?? ''"
                :aria-label="$t('generateReport.labelReportBackFromYear')"
                @input="onYearInput"
              />
              <button
                v-if="year != null"
                type="button"
                class="year-stepper__clear"
                :aria-label="$t('generateReport.labelReportBackFromYear')"
                @click="year = null"
              >
                ×
              </button>
              <div class="year-stepper__spin">
                <button
                  type="button"
                  :aria-label="$t('generateReport.labelReportBackFromYear')"
                  @click="stepYear(1)"
                >
                  <span class="year-stepper__caret year-stepper__caret--up" />
                </button>
                <button
                  type="button"
                  :aria-label="$t('generateReport.labelReportBackFromYear')"
                  @click="stepYear(-1)"
                >
                  <span class="year-stepper__caret year-stepper__caret--down" />
                </button>
              </div>
            </div>
          </v-input>
        </div>

        <p class="leader-sheet__hint">
          <span>{{ $t("generateReport.leadersYearHint") }}</span>
        </p>

        <div class="leader-sheet__row">
          <div class="leader-sheet__label">
            {{ $t("generateReport.sectionDataReports") }}
          </div>
          <v-input
            :model-value="reportType"
            class="leader-sheet__types"
            :rules="[required($t('generateReport.sectionDataReports'))]"
            hide-details="auto"
          >
            <div class="leader-sheet__options">
              <label
                v-for="option in options"
                :key="option.id"
                class="sheet-option"
              >
                <input
                  v-model="reportType"
                  type="radio"
                  name="leader-sheet-report"
                  :value="option.id"
                />
                <span class="sheet-option__name">{{ option.name }}</span>
                <span
                  v-if="option.code"
                  class="sheet-option__code"
                >
                  {{ option.code }}
                </span>
                <span
                  v-if="option.hint"
                  class="sheet-option__hint"
                >
                  ({{ option.hint }})
                </span>
              </label>
            </div>
          </v-input>
        </div>

        <div class="leader-sheet__actions">
          <v-btn
            color="primary"
            type="submit"
            class="leader-sheet__generate"
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
.leader-sheet__card {
  border-color: #d9d9d9;
  background: #fff;
}

.leader-sheet__panel {
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

.leader-sheet__icon {
  display: block;
  flex: 0 0 auto;
}

.leader-sheet__row {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: 12px 24px;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e4e4;
}

.leader-sheet__label {
  color: #3a3a3a;
  font-size: 0.875rem;
  line-height: 1.3;
}

.leader-sheet__scope {
  display: block;
  margin-top: 4px;
  padding: 0;
  border: 0;
  background: none;
  color: #1a73c7;
  font-size: 0.875rem;
  line-height: 1.3;
  cursor: pointer;
  text-align: left;
}

.leader-sheet__user,
.leader-sheet__region,
.leader-sheet__year {
  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.leader-sheet__year {
  :deep(.v-input__control) {
    display: flex;
  }
}

.leader-sheet__year.v-input--error .year-stepper {
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

.leader-sheet__hint {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: 12px 24px;
  margin: 0;
  padding: 14px 16px;
  border-bottom: 1px solid #e4e4e4;
  color: #1f9d3a;
  font-size: 0.875rem;
  line-height: 1.45;
}

.leader-sheet__hint span {
  grid-column: 2;
}

.leader-sheet__types {
  :deep(.v-input__control) {
    display: block;
  }

  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.leader-sheet__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sheet-option {
  display: grid;
  grid-template-columns: 16px minmax(0, 340px) auto auto;
  gap: 8px 16px;
  align-items: center;
  min-height: 24px;
  color: #333;
  font-size: 0.875rem;
  line-height: 1.3;
  cursor: pointer;
}

.sheet-option input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #757575;
  cursor: pointer;
}

.sheet-option__code {
  color: #1f9d3a;
  white-space: nowrap;
}

.sheet-option__hint {
  color: #8a8a8a;
  white-space: nowrap;
}

.leader-sheet__actions {
  display: flex;
  justify-content: flex-end;
  padding: 28px 16px 16px;
}

.leader-sheet__generate {
  min-width: 118px;
  letter-spacing: 0.04em;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 3px;
}

@media (max-width: 767px) {
  .leader-sheet__row,
  .leader-sheet__hint {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .leader-sheet__hint span {
    grid-column: 1;
  }

  .sheet-option {
    grid-template-columns: 16px minmax(0, 1fr);
  }
}
</style>
