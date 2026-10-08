<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import SelectInput from "@/components/input/SelectInput.vue";
import UserSelectInput from "@/components/input/UserSelectInput.vue";
import { monthOptions, useGenerateReport, yearOptions } from "@/composables/useGenerateReport";
import { useAuthStore } from "@/stores/authStore";
import { useGeographicalRegionStore } from "@/stores/geographicalRegionStore";

defineOptions({ name: "GenerateReportChurchStatus" });

const { t, te } = useI18n();
const authStore = useAuthStore();
const geographicalRegionStore = useGeographicalRegionStore();

const { reportTypeOptions, errorMessage, submitting, loadingFormData, generate } =
  useGenerateReport("church_report_status");

const formRef = ref();
const userId = ref<number | string | null>(authStore.user?.id ?? null);
const reportType = ref<string | null>(null);
const endMonth = ref<string | null>(String(new Date().getMonth() + 1));
const endYear = ref<string | null>(String(new Date().getFullYear()));
const showGeoScope = ref(false);
const geographicalRegionId = ref<number | null>(null);

const months = computed(() => monthOptions(t));
const years = yearOptions();
const geographicalRegions = computed(() => geographicalRegionStore.asyncOptions);

const REPORT_CODES: Record<string, string> = {
  "12_months_status_report_by_user": "[# 9]",
};

const TYPE_HINT_KEYS: Record<string, string> = {
  "12_months_status_report_by_user": "generateReport.typeHints.weeklyData",
};

function typeHint(id: string) {
  const key = TYPE_HINT_KEYS[id];
  return key && te(key) ? t(key) : "";
}

const options = computed(() => {
  const fallbackKey = "generateReport.types.12_months_status_report_by_user";
  const source = reportTypeOptions.value.length
    ? reportTypeOptions.value
    : [
        {
          id: "12_months_status_report_by_user",
          name: te(fallbackKey) ? t(fallbackKey) : "12 Months Reporting status by Leader",
        },
      ];

  return source.map((option) => ({
    ...option,
    code: REPORT_CODES[option.id] ?? "",
    hint: typeHint(option.id),
  }));
});

const selectedMonthName = computed(
  () => months.value.find((month) => month.id === endMonth.value)?.name || "",
);

const fromYear = computed(() => (endYear.value ? String(Number(endYear.value) - 1) : ""));

const required = (field: string) => (v: unknown) =>
  (v !== null && v !== undefined && v !== "") || t("validation.required", { field });

watch(options, (items) => {
  if (reportType.value && items.some((option) => option.id === reportType.value)) return;
  reportType.value = items[0]?.id ?? null;
});

watch(showGeoScope, (open) => {
  if (!open) geographicalRegionId.value = null;
});

const onSubmit = async () => {
  const { valid } = (await formRef.value?.validate()) ?? { valid: true };
  if (!valid || !reportType.value) return;

  const payload: Record<string, unknown> = {
    user_id: userId.value,
    end_month: Number(endMonth.value),
    end_year: Number(endYear.value),
    report_type: reportType.value,
  };

  if (showGeoScope.value && geographicalRegionId.value) {
    payload.geographical_region_id = geographicalRegionId.value;
  }

  await generate("churchReportStatus", payload, `${reportType.value}.pdf`);
};
</script>

<template>
  <div class="status-report">
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
      class="status-report__card"
      variant="outlined"
      rounded="0"
      elevation="0"
    >
      <div class="status-report__panel">
        <svg
          class="status-report__icon"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <circle
            cx="8"
            cy="8"
            r="7"
            fill="#43a047"
          />
          <path
            d="M4.4 8.2 6.7 10.4 11.6 5.4"
            fill="none"
            stroke="#fff"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ $t("generateReport.statusReportOverseer") }}</span>
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

        <div class="status-report__row">
          <div>
            <div class="status-report__label">
              {{ $t("generateReport.labelReportOn") }}
            </div>
            <button
              v-if="false"
              type="button"
              class="status-report__scope"
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
            class="status-report__user"
            placeholder="generateReport.selectUser"
            :clearable="false"
            hide-details="auto"
            :rules="[required($t('generateReport.labelReportOn'))]"
          />
        </div>

        <div
          v-if="showGeoScope"
          class="status-report__row"
        >
          <div class="status-report__label">
            {{ $t("generateReport.labelGeographicalRegion") }}
          </div>
          <SelectInput
            v-model="geographicalRegionId"
            class="status-report__region"
            :items="geographicalRegions"
            item-title="name"
            item-value="id"
            :clearable="false"
            hide-details="auto"
          />
        </div>

        <div class="status-report__row">
          <div class="status-report__label">
            {{ $t("generateReport.labelReport1YearBackFrom") }}
          </div>
          <div class="status-report__period">
            <SelectInput
              v-model="endMonth"
              class="status-report__period-field"
              :items="months"
              item-title="name"
              item-value="id"
              :placeholder="$t('generateReport.placeholderMonth')"
              :clearable="false"
              hide-details="auto"
              :rules="[required($t('generateReport.labelEndMonth'))]"
            />
            <SelectInput
              v-model="endYear"
              class="status-report__period-field"
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

        <p class="status-report__hint">
          {{
            $t("generateReport.report1YearBackHint", {
              month: selectedMonthName,
              year: endYear,
              fromYear,
            })
          }}
        </p>

        <div class="status-report__row">
          <div class="status-report__label">
            {{ $t("generateReport.sectionDataReports") }}
          </div>
          <v-input
            :model-value="reportType"
            class="status-report__types"
            :rules="[required($t('generateReport.sectionDataReports'))]"
            hide-details="auto"
          >
            <div class="status-report__options">
              <label
                v-for="option in options"
                :key="option.id"
                class="status-option"
              >
                <input
                  v-model="reportType"
                  type="radio"
                  name="church-status-report"
                  :value="option.id"
                />
                <span>{{ option.name }}</span>
                <span
                  v-if="option.code"
                  class="status-option__code"
                >
                  {{ option.code }}
                </span>
                <span
                  v-if="option.hint"
                  class="status-option__hint"
                >
                  ({{ option.hint }})
                </span>
              </label>
            </div>
          </v-input>
        </div>

        <div class="status-report__actions">
          <v-btn
            color="primary"
            type="submit"
            class="status-report__generate"
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
.status-report__card {
  border-color: #d9d9d9;
  background: #fff;
}

.status-report__panel {
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

.status-report__icon {
  display: block;
  flex: 0 0 auto;
}

.status-report__row {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: 12px 24px;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e4e4;
}

.status-report__label {
  color: #3a3a3a;
  font-size: 0.875rem;
  line-height: 1.3;
}

.status-report__scope {
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

.status-report__user,
.status-report__region,
.status-report__period-field {
  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.status-report__period {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.status-report__period-field {
  width: 148px;
  max-width: 100%;
}

.status-report__hint {
  margin: 0;
  padding: 14px 16px;
  border-bottom: 1px solid #e4e4e4;
  color: #1f9d3a;
  font-size: 0.875rem;
  line-height: 1.45;
}

.status-report__types {
  :deep(.v-input__control) {
    display: block;
  }

  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.status-report__options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.status-option {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  min-height: 24px;
  color: #333;
  font-size: 0.875rem;
  line-height: 1.3;
  cursor: pointer;
}

.status-option input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #757575;
  cursor: pointer;
}

.status-option__code {
  color: #1f9d3a;
  white-space: nowrap;
}

.status-option__hint {
  color: #8a8a8a;
  white-space: nowrap;
}

.status-report__actions {
  display: flex;
  justify-content: flex-end;
  padding: 28px 16px 16px;
}

.status-report__generate {
  min-width: 118px;
  letter-spacing: 0.04em;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 3px;
}

@media (max-width: 767px) {
  .status-report__row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
