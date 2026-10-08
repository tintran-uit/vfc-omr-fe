<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import ChurchSelectInput from "@/components/input/ChurchSelectInput.vue";
import SelectInput from "@/components/input/SelectInput.vue";
import { monthOptions, yearOptions } from "@/composables/useGenerateReport";
import { MSC_REPORT_TYPE } from "@/constants/reportConstant";
import { readBlobError } from "@/helpers/fileDownload";
import { generateReportService, type ReportEndpointKey } from "@/services/generateReportService";

defineOptions({ name: "GenerateReportChurch" });

type ReportGroupKey = "data" | "graph" | "visit" | "financial";

type ReportDefinition = {
  id: string;
  code: string;
  hintKey: string;
  nameKey: string;
  group: ReportGroupKey;
  endpoint: ReportEndpointKey;
  yearOnly: boolean;
};

const GROUPS: { key: ReportGroupKey; titleKey: string }[] = [
  { key: "data", titleKey: "generateReport.sectionDataReports" },
  { key: "graph", titleKey: "generateReport.sectionGraphReports" },
  { key: "visit", titleKey: "generateReport.sectionVisitReports" },
  { key: "financial", titleKey: "generateReport.sectionFinancialReports" },
];

const REPORTS: ReportDefinition[] = [
  {
    id: "1_month_weekly",
    code: "[# 1]",
    hintKey: "generateReport.typeHints.weeklyData",
    nameKey: "generateReport.churchData1Month",
    group: "data",
    endpoint: "church",
    yearOnly: false,
  },
  {
    id: "6_months_weekly",
    code: "[# 2]",
    hintKey: "generateReport.typeHints.weeklyData",
    nameKey: "generateReport.churchData6Months",
    group: "data",
    endpoint: "church",
    yearOnly: false,
  },
  {
    id: "12_months_weekly",
    code: "[# 3]",
    hintKey: "generateReport.typeHints.weeklyData",
    nameKey: "generateReport.churchData12Months",
    group: "data",
    endpoint: "church",
    yearOnly: false,
  },
  {
    id: "12_months_average",
    code: "[# 4]",
    hintKey: "generateReport.typeHints.monthlyAveragedData",
    nameKey: "generateReport.churchData12Months",
    group: "data",
    endpoint: "church",
    yearOnly: false,
  },
  {
    id: "36_months_average",
    code: "[# 5]",
    hintKey: "generateReport.typeHints.monthlyAveragedData",
    nameKey: "generateReport.churchData3Years",
    group: "data",
    endpoint: "church",
    yearOnly: false,
  },
  {
    id: "36_months_projections",
    code: "[# 33]",
    hintKey: "",
    nameKey: "generateReport.types.36_months_projections",
    group: "data",
    endpoint: "church",
    yearOnly: true,
  },
  {
    id: "12_months_quick_look_graph",
    code: "[# 10]",
    hintKey: "generateReport.typeHints.weeklyAsDashboard",
    nameKey: "generateReport.types.12_months_quick_look_graph",
    group: "graph",
    endpoint: "churchGraph",
    yearOnly: true,
  },
  {
    id: "12_months_weekly_graph",
    code: "[# 11]",
    hintKey: "generateReport.typeHints.weeklyMoreComprehensive",
    nameKey: "generateReport.churchGraph12Report",
    group: "graph",
    endpoint: "churchGraph",
    yearOnly: true,
  },
  {
    id: "12_months_average_graph",
    code: "[# 12]",
    hintKey: "generateReport.typeHints.monthlyAveragedData",
    nameKey: "generateReport.churchGraph12Report",
    group: "graph",
    endpoint: "churchGraph",
    yearOnly: true,
  },
  {
    id: "36_months_average_graph",
    code: "[# 13]",
    hintKey: "generateReport.typeHints.monthlyAveragedData",
    nameKey: "generateReport.churchGraph3Years",
    group: "graph",
    endpoint: "churchGraph",
    yearOnly: true,
  },
  {
    id: "24_months_visits_monthly",
    code: "[# 19]",
    hintKey: "generateReport.typeHints.monthlyByIndividualChurch",
    nameKey: "generateReport.churchVisit2Years",
    group: "visit",
    endpoint: "visitReport",
    yearOnly: true,
  },
  {
    id: "1_month_accounts",
    code: "[# 17]",
    hintKey: "generateReport.typeHints.monthlyByIndividualChurch",
    nameKey: "generateReport.churchAccounts1Month",
    group: "financial",
    endpoint: "church",
    yearOnly: true,
  },
  {
    id: "12_months_accounts",
    code: "[# 18]",
    hintKey: "generateReport.typeHints.monthlyByIndividualChurch",
    nameKey: "generateReport.churchAccounts12Months",
    group: "financial",
    endpoint: "church",
    yearOnly: true,
  },
];

const { t } = useI18n();

const formRef = ref();
const churchId = ref<number | null>(null);
const reportType = ref<string>(REPORTS[0].id);
const endMonth = ref<string | null>(String(new Date().getMonth() + 1));
const currentYear = new Date().getFullYear();
const endYear = ref<string | null>(String(currentYear));
const months = computed(() => monthOptions(t));
const years = yearOptions(currentYear - 1500, 5);
const submitting = ref(false);
const errorMessage = ref("");

const selectedReport = computed(
  () => REPORTS.find((report) => report.id === reportType.value) ?? REPORTS[0],
);
const showsMonth = computed(() => !selectedReport.value.yearOnly);

const groups = computed(() =>
  GROUPS.map((group) => ({
    ...group,
    options: REPORTS.filter((report) => report.group === group.key).map((report) => ({
      ...report,
      name: t(report.nameKey),
      hint: report.hintKey ? t(report.hintKey) : "",
    })),
  })),
);

const required = (field: string) => (v: unknown) =>
  (v !== null && v !== undefined && v !== "") || t("validation.required", { field });

const monthRules = computed(() =>
  showsMonth.value ? [required(t("generateReport.labelEndMonth"))] : [],
);

const onSubmit = async () => {
  const { valid } = (await formRef.value?.validate()) ?? { valid: true };
  if (!valid || !selectedReport.value) return;

  const payload: Record<string, unknown> = {
    church_id: churchId.value,
    end_year: Number(endYear.value),
    report_type: selectedReport.value.id,
    msc_report_type: MSC_REPORT_TYPE,
  };

  if (showsMonth.value) {
    payload.end_month = Number(endMonth.value);
  }

  errorMessage.value = "";
  submitting.value = true;
  try {
    await generateReportService.generate(
      selectedReport.value.endpoint,
      payload,
      `${selectedReport.value.id}.pdf`,
    );
  } catch (e) {
    errorMessage.value = (await readBlobError(e)) || t("generateReport.generateError");
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="church-report">
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
      class="church-report__card"
      variant="outlined"
      rounded="0"
      elevation="0"
    >
      <div class="church-report__panel">
        <svg
          class="church-report__icon"
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
        <span>{{ $t("generateReport.churchTitle") }}</span>
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

        <div class="church-report__row">
          <div class="church-report__label">
            {{ $t("generateReport.labelChurch") }}
          </div>
          <div class="church-report__church">
            <ChurchSelectInput
              v-model="churchId"
              placeholder="generateReport.selectAChurch"
              :rules="[required($t('generateReport.labelChurch'))]"
            />
          </div>
        </div>

        <div class="church-report__row">
          <div class="church-report__label">
            {{ $t("generateReport.labelReportBackFrom") }}
          </div>
          <div class="church-report__period">
            <div
              v-show="showsMonth"
              class="church-report__period-field"
            >
              <SelectInput
                v-model="endMonth"
                :items="months"
                item-title="name"
                item-value="id"
                :placeholder="$t('generateReport.placeholderMonth')"
                :clearable="false"
                hide-details="auto"
                :rules="monthRules"
              />
            </div>
            <div class="church-report__period-field">
              <SelectInput
                v-model="endYear"
                :items="years"
                item-title="name"
                item-value="id"
                :placeholder="$t('generateReport.placeholderYear')"
                :clearable="false"
                hide-details="auto"
                :rules="[required($t('generateReport.labelEndYear'))]"
              />
            </div>
          </div>
        </div>

        <p class="church-report__hint">
          <span>{{ $t("generateReport.churchReportBackHint") }}</span>
        </p>

        <div
          v-for="group in groups"
          :key="group.key"
          class="church-report__group"
        >
          <div class="church-report__label">
            {{ $t(group.titleKey) }}
          </div>
          <div class="church-report__group-icon">
            <svg
              v-if="group.key === 'data'"
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
            <svg
              v-else-if="group.key === 'graph'"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <rect
                x="1"
                y="8"
                width="3"
                height="7"
                fill="#43a047"
              />
              <rect
                x="6.5"
                y="4"
                width="3"
                height="11"
                fill="#1e88e5"
              />
              <rect
                x="12"
                y="1"
                width="3"
                height="14"
                fill="#f9a825"
              />
            </svg>
            <svg
              v-else-if="group.key === 'visit'"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                fill="#9aa0a6"
                d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
              />
            </svg>
            <svg
              v-else
              viewBox="0 0 16 16"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="8"
                r="6.2"
                fill="#f6e27a"
                stroke="#d4a017"
                stroke-width="0.8"
              />
              <text
                x="8"
                y="11.2"
                text-anchor="middle"
                font-size="9"
                font-family="sans-serif"
                fill="#7a5b00"
              >
                $
              </text>
            </svg>
          </div>
          <div class="church-report__options">
            <label
              v-for="option in group.options"
              :key="option.id"
              class="church-option"
            >
              <input
                v-model="reportType"
                type="radio"
                name="church-report"
                :value="option.id"
              />
              <span class="church-option__name">{{ option.name }}</span>
              <span class="church-option__code">{{ option.code }}</span>
              <span
                v-if="option.hint"
                class="church-option__hint"
              >
                ({{ option.hint }})
              </span>
            </label>
          </div>
        </div>

        <div class="church-report__actions">
          <v-btn
            color="primary"
            type="submit"
            class="church-report__generate"
            :loading="submitting"
          >
            {{ $t("generateReport.generateShort") }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.church-report__card {
  border-color: #d9d9d9;
  background: #fff;
}

.church-report__panel {
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

.church-report__icon {
  display: block;
  flex: 0 0 auto;
}

.church-report__row,
.church-report__hint,
.church-report__group {
  display: grid;
  grid-template-columns: minmax(170px, 220px) minmax(0, 1fr);
  gap: 12px 16px;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #e4e4e4;
}

.church-report__group {
  grid-template-columns: minmax(150px, 190px) 22px minmax(0, 1fr);
  align-items: start;
}

.church-report__label {
  color: #3a3a3a;
  font-size: 0.875rem;
  line-height: 1.35;
}

.church-report__church {
  min-width: 0;

  :deep(.v-label) {
    display: none;
  }

  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.church-report__period {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.church-report__period-field {
  flex: 1 1 220px;
  width: auto;
  min-width: 180px;
  max-width: 320px;

  :deep(.v-input__details) {
    padding-inline: 0;
  }

  :deep(.v-autocomplete__selection) {
    max-width: 100%;
  }

  :deep(.v-autocomplete__selection-text) {
    overflow: visible;
    text-overflow: clip;
  }

  :deep(.v-input--dirty:not(:focus-within) input) {
    flex: 0 0 0;
    width: 0;
    min-width: 0 !important;
  }
}

.church-report__hint {
  margin: 0;
  color: #1f9d3a;
  font-size: 0.875rem;
  line-height: 1.45;
}

.church-report__hint span {
  grid-column: 2;
}

.church-report__group-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 3px;
}

.church-report__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.church-option {
  display: grid;
  grid-template-columns: 16px minmax(210px, 280px) auto auto;
  gap: 8px 14px;
  align-items: center;
  min-height: 24px;
  color: #333;
  font-size: 0.875rem;
  line-height: 1.3;
  cursor: pointer;
}

.church-option input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #757575;
  cursor: pointer;
}

.church-option__code,
.church-option__hint {
  color: #1f9d3a;
  white-space: nowrap;
}

.church-report__actions {
  display: flex;
  justify-content: flex-end;
  padding: 28px 16px 16px;
}

.church-report__generate {
  min-width: 118px;
  letter-spacing: 0.04em;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 3px;
}

@media (max-width: 767px) {
  .church-report__row,
  .church-report__hint,
  .church-report__group {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .church-report__hint span {
    grid-column: 1;
  }

  .church-option {
    grid-template-columns: 16px minmax(0, 1fr);
  }
}
</style>
