<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import UserSelectInput from "@/components/input/UserSelectInput.vue";
import { useGenerateReport } from "@/composables/useGenerateReport";

defineOptions({ name: "GenerateReportLeadersGraph" });

const REPORTS = [
  {
    id: "36_months_cumulative_church_planting",
    code: "[# 16]",
    hintKey: "generateReport.typeHints.monthlyData",
    nameKey: "generateReport.leaderGraphCumulative",
  },
  {
    id: "12_months_visits_to_churches",
    code: "[# 22]",
    hintKey: "generateReport.typeHints.monthlyData",
    nameKey: "generateReport.leaderGraphVisits",
  },
] as const;

const { t, te } = useI18n();

const { reportTypeOptions, errorMessage, submitting, loadingFormData, generate } =
  useGenerateReport("user_graph");

const formRef = ref();
const userId = ref<number | string | null>(null);
const reportType = ref<string | null>(null);
const year = ref<number | null>(new Date().getFullYear());

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
    "userGraph",
    {
      user_id: userId.value,
      end_year: Number(year.value),
      report_type: reportType.value,
    },
    `${reportType.value}.pdf`,
  );
};
</script>

<template>
  <div class="leader-graph">
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
      class="leader-graph__card"
      variant="outlined"
      rounded="0"
      elevation="0"
    >
      <div class="leader-graph__panel">
        <svg
          class="leader-graph__icon"
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
        <span>{{ $t("generateReport.leadersGraphTitle") }}</span>
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

        <div class="leader-graph__row">
          <div class="leader-graph__label">
            {{ $t("generateReport.labelVisitUser") }}
          </div>
          <UserSelectInput
            v-model="userId"
            class="leader-graph__user"
            placeholder="generateReport.selectAUser"
            :clearable="false"
            hide-details="auto"
            :rules="[required($t('generateReport.labelVisitUser'))]"
          />
        </div>

        <div class="leader-graph__row">
          <div class="leader-graph__label">
            {{ $t("generateReport.labelReportBackFromYear") }}
          </div>
          <v-input
            :model-value="year"
            class="leader-graph__year"
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

        <p class="leader-graph__hint">
          <span>{{ $t("generateReport.leadersYearHint") }}</span>
        </p>

        <div class="leader-graph__row">
          <div class="leader-graph__label">
            {{ $t("generateReport.sectionGraphReports") }}
          </div>
          <v-input
            :model-value="reportType"
            class="leader-graph__types"
            :rules="[required($t('generateReport.sectionGraphReports'))]"
            hide-details="auto"
          >
            <div class="leader-graph__options">
              <label
                v-for="option in options"
                :key="option.id"
                class="graph-option"
              >
                <input
                  v-model="reportType"
                  type="radio"
                  name="leader-graph-report"
                  :value="option.id"
                />
                <span>{{ option.name }}</span>
                <span
                  v-if="option.code"
                  class="graph-option__code"
                >
                  {{ option.code }}
                </span>
                <span
                  v-if="option.hint"
                  class="graph-option__hint"
                >
                  ({{ option.hint }})
                </span>
              </label>
            </div>
          </v-input>
        </div>

        <div class="leader-graph__actions">
          <v-btn
            color="primary"
            type="submit"
            class="leader-graph__generate"
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
.leader-graph__card {
  border-color: #d9d9d9;
  background: #fff;
}

.leader-graph__panel {
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

.leader-graph__icon {
  display: block;
  flex: 0 0 auto;
}

.leader-graph__row {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: 12px 24px;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e4e4;
}

.leader-graph__label {
  color: #3a3a3a;
  font-size: 0.875rem;
  line-height: 1.3;
}

.leader-graph__user,
.leader-graph__year {
  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.leader-graph__year {
  :deep(.v-input__control) {
    display: flex;
  }
}

.leader-graph__year.v-input--error .year-stepper {
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

.leader-graph__hint {
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

.leader-graph__hint span {
  grid-column: 2;
}

.leader-graph__types {
  :deep(.v-input__control) {
    display: block;
  }

  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.leader-graph__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.graph-option {
  display: grid;
  grid-template-columns: 16px minmax(0, 360px) auto auto;
  gap: 8px 16px;
  align-items: center;
  min-height: 24px;
  color: #333;
  font-size: 0.875rem;
  line-height: 1.3;
  cursor: pointer;
}

.graph-option input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #757575;
  cursor: pointer;
}

.graph-option__code {
  color: #1f9d3a;
  white-space: nowrap;
}

.graph-option__hint {
  color: #8a8a8a;
  white-space: nowrap;
}

.leader-graph__actions {
  display: flex;
  justify-content: flex-end;
  padding: 28px 16px 16px;
}

.leader-graph__generate {
  min-width: 118px;
  letter-spacing: 0.04em;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 3px;
}

@media (max-width: 767px) {
  .leader-graph__row,
  .leader-graph__hint {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .leader-graph__hint span {
    grid-column: 1;
  }

  .graph-option {
    grid-template-columns: 16px minmax(0, 1fr);
  }
}
</style>
