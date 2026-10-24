<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import SelectInput from "@/components/input/SelectInput.vue";
import UserSelectInput from "@/components/input/UserSelectInput.vue";
import { yearOptions } from "@/composables/useGenerateReport";
import { readBlobError } from "@/helpers/fileDownload";
import { generateReportService } from "@/services/generateReportService";

defineOptions({ name: "GenerateReportVisit" });

const REPORT_TYPE = "24_months_visits";

const { t } = useI18n();

const formRef = ref();
const userId = ref<number | string | null>(null);
const currentYear = new Date().getFullYear();
const endYear = ref<string | null>(String(currentYear));
const years = yearOptions(currentYear - 1500, 5);
const submitting = ref(false);
const errorMessage = ref("");

const required = (field: string) => (v: unknown) =>
  (v !== null && v !== undefined && v !== "") || t("validation.required", { field });

const onSubmit = async () => {
  const { valid } = (await formRef.value?.validate()) ?? { valid: true };
  if (!valid || !endYear.value) return;

  errorMessage.value = "";
  submitting.value = true;
  try {
    await generateReportService.generate(
      "userData",
      {
        user_id: userId.value,
        end_year: Number(endYear.value),
        report_type: REPORT_TYPE,
      },
      `${REPORT_TYPE}.xlsx`,
    );
  } catch (e) {
    errorMessage.value = (await readBlobError(e)) || t("generateReport.generateError");
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="visit-report">
    <div class="visit-report__banner">
      {{ $t("generateReport.visitPageTitle") }}
    </div>

    <v-card
      class="visit-report__card"
      variant="outlined"
      rounded="0"
      elevation="0"
    >
      <div class="visit-report__panel">
        <svg
          class="visit-report__icon"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <rect
            x="1"
            y="9"
            width="3.2"
            height="6"
            fill="#43a047"
          />
          <rect
            x="6.4"
            y="5"
            width="3.2"
            height="10"
            fill="#1e88e5"
          />
          <rect
            x="11.8"
            y="1"
            width="3.2"
            height="14"
            fill="#e53935"
          />
        </svg>
        <span>{{ $t("generateReport.sectionVisitReports") }}</span>
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

        <div class="visit-report__row">
          <div class="visit-report__label">
            {{ $t("generateReport.labelVisitUser") }}
          </div>
          <div class="visit-report__field">
            <UserSelectInput
              v-model="userId"
              class="visit-report__user"
              placeholder="generateReport.selectAUser"
              :clearable="false"
              hide-details="auto"
              :rules="[required($t('generateReport.labelVisitUser'))]"
            />
          </div>
        </div>

        <div class="visit-report__row">
          <div class="visit-report__label">
            {{ $t("generateReport.labelReportBackFromYear") }}
          </div>
          <div class="visit-report__field visit-report__year">
            <SelectInput
              v-model="endYear"
              :items="years"
              item-title="name"
              item-value="id"
              :placeholder="$t('generateReport.placeholderYear')"
              :clearable="false"
              hide-details="auto"
              :rules="[required($t('generateReport.labelReportBackFromYear'))]"
            />
          </div>
        </div>

        <div class="visit-report__actions">
          <v-btn
            color="primary"
            type="submit"
            class="visit-report__generate"
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
.visit-report__banner {
  margin-bottom: 16px;
  padding: 14px 18px;
  background: #3d4b5c;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
}

.visit-report__card {
  border-color: #d9d9d9;
  background: #fff;
}

.visit-report__panel {
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

.visit-report__icon {
  display: block;
  flex: 0 0 auto;
}

.visit-report__row {
  display: grid;
  grid-template-columns: minmax(180px, 280px) minmax(0, 1fr);
  gap: 12px 24px;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #e4e4e4;
}

.visit-report__label {
  color: #3a3a3a;
  font-size: 0.875rem;
  line-height: 1.3;
}

.visit-report__user {
  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.visit-report__year {
  flex: 1 1 220px;
  width: auto;
  min-width: 180px;
  max-width: 320px;

  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.visit-report__actions {
  display: flex;
  justify-content: flex-end;
  padding: 28px 16px 16px;
}

.visit-report__generate {
  min-width: 118px;
  letter-spacing: 0.04em;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 3px;
}

@media (max-width: 767px) {
  .visit-report__row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
