<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import SelectInput from "@/components/input/SelectInput.vue";
import { readBlobError } from "@/helpers/fileDownload";
import { generateReportService } from "@/services/generateReportService";
import { userService } from "@/services/userService";

defineOptions({ name: "GenerateReportOverseerGoalsActuals3Year" });

const REPORT_TYPE = "40";

type OverseerOption = { id: number | string; name: string };
type PeriodOption = { id: string; name: string; endYear: number };

const { t } = useI18n();

const formRef = ref();
const overseerId = ref<number | string | null>(null);
const periodId = ref<string | null>(String(new Date().getFullYear() - 2));
const overseers = ref<OverseerOption[]>([]);
const submitting = ref(false);
const errorMessage = ref("");

const periods = computed<PeriodOption[]>(() => {
  const current = new Date().getFullYear();
  const options: PeriodOption[] = [];

  for (let endYear = current; endYear >= current - 20; endYear -= 1) {
    const startYear = endYear - 2;
    options.push({
      id: String(startYear),
      name: `${startYear} - ${endYear}`,
      endYear,
    });
  }

  return options;
});

const required = (field: string) => (v: unknown) =>
  (v !== null && v !== undefined && v !== "") || t("validation.required", { field });

onMounted(async () => {
  try {
    const data = await userService.getOverseerList({ limit: 200, page: 1 });
    overseers.value = data?.items || [];
  } catch (e) {
    console.error("Failed to load overseers:", e);
  }
});

const onSubmit = async () => {
  const { valid } = (await formRef.value?.validate()) ?? { valid: true };
  const period = periods.value.find((item) => item.id === periodId.value);
  if (!valid || !period) return;

  errorMessage.value = "";
  submitting.value = true;
  try {
    await generateReportService.generate(
      "event",
      {
        user_id: overseerId.value,
        report_type: REPORT_TYPE,
        start_year: Number(period.id),
        end_year: period.endYear,
      },
      "overseer-goals-actuals-3yrs.pdf",
    );
  } catch (e) {
    errorMessage.value = (await readBlobError(e)) || t("generateReport.generateError");
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="goals-report">
    <div class="goals-report__banner">
      {{ $t("generateReport.bannerGenerateReport") }}
    </div>

    <v-card
      class="goals-report__card"
      variant="outlined"
      rounded="0"
      elevation="0"
    >
      <div class="goals-report__panel">
        <svg
          class="goals-report__icon"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path
            d="M2 4.5h12M2 8h12M2 11.5h12"
            fill="none"
            stroke="#757575"
            stroke-width="1.4"
            stroke-linecap="round"
          />
        </svg>
        <span>{{ $t("generateReport.overseerOverviewReport") }}</span>
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

        <div class="goals-report__row">
          <div class="goals-report__label">
            {{ $t("generateReport.labelOverseer") }}
            <span class="goals-report__required">*</span>
          </div>
          <SelectInput
            v-model="overseerId"
            class="goals-report__overseer"
            :items="overseers"
            item-title="name"
            item-value="id"
            hide-details="auto"
            :rules="[required($t('generateReport.labelOverseer'))]"
          />
        </div>

        <div class="goals-report__row goals-report__row--period">
          <div class="goals-report__label">
            {{ $t("generateReport.labelGoalPeriod") }}
          </div>
          <div class="goals-report__period">
            <SelectInput
              v-model="periodId"
              class="goals-report__period-field"
              :items="periods"
              item-title="name"
              item-value="id"
              hide-details="auto"
              :rules="[required($t('generateReport.labelGoalPeriod'))]"
            />
            <v-btn
              color="primary"
              type="submit"
              class="goals-report__generate"
              :loading="submitting"
            >
              {{ $t("generateReport.generateShort") }}
            </v-btn>
          </div>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.goals-report__banner {
  margin-bottom: 16px;
  padding: 14px 18px;
  background: #3d4b5c;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
}

.goals-report__card {
  border-color: #d9d9d9;
  background: #fff;
}

.goals-report__panel {
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

.goals-report__icon {
  display: block;
  flex: 0 0 auto;
}

.goals-report__row {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: 12px 24px;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e4e4;
}

.goals-report__row--period {
  border-bottom: 0;
}

.goals-report__label {
  color: #3a3a3a;
  font-size: 0.875rem;
  line-height: 1.3;
}

.goals-report__required {
  color: #e53935;
}

.goals-report__overseer {
  max-width: 460px;

  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.goals-report__period {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.goals-report__period-field {
  width: 180px;
  max-width: 100%;
  flex: 0 0 auto;

  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.goals-report__generate {
  min-width: 118px;
  letter-spacing: 0.04em;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 3px;
}

@media (max-width: 767px) {
  .goals-report__row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .goals-report__period {
    align-items: stretch;
    flex-direction: column;
  }

  .goals-report__generate {
    align-self: flex-end;
  }
}
</style>
