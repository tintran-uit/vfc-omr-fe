<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import UserSelectInput from "@/components/input/UserSelectInput.vue";
import { readBlobError } from "@/helpers/fileDownload";
import { generateReportService } from "@/services/generateReportService";

defineOptions({ name: "GenerateReportOverseerAccessRights" });

const REPORTS = [
  {
    id: "41",
    code: "[# 41]",
    nameKey: "generateReport.accessRightsUnder",
  },
  {
    id: "42",
    code: "[# 42]",
    nameKey: "generateReport.accessRightsDashboard",
  },
] as const;

const { t } = useI18n();

const formRef = ref();
const userId = ref<number | string | null>(null);
const reportType = ref<string>(REPORTS[1].id);
const submitting = ref(false);
const errorMessage = ref("");

const required = (field: string) => (v: unknown) =>
  (v !== null && v !== undefined && v !== "") || t("validation.required", { field });

const onSubmit = async () => {
  const { valid } = (await formRef.value?.validate()) ?? { valid: true };
  if (!valid || !reportType.value) return;

  errorMessage.value = "";
  submitting.value = true;
  try {
    await generateReportService.generate(
      "overseerAccessRights",
      {
        user_id: userId.value,
        report_type: reportType.value,
      },
      "overseer-access-rights.pdf",
    );
  } catch (e) {
    errorMessage.value = (await readBlobError(e)) || t("generateReport.generateError");
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="access-report">
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
      class="access-report__card"
      variant="outlined"
      rounded="0"
      elevation="0"
    >
      <div class="access-report__panel">
        <svg
          class="access-report__icon"
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
        <span>{{ $t("generateReport.accessRightsPanel") }}</span>
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

        <div class="access-report__row">
          <div class="access-report__label-wrap">
            <span class="access-report__label">
              {{ $t("generateReport.labelUser") }}
            </span>
            <v-tooltip
              location="top"
              :text="$t('generateReport.accessRightsLeaderHelp')"
            >
              <template #activator="{ props }">
                <button
                  v-bind="props"
                  type="button"
                  class="access-report__help"
                  :aria-label="$t('generateReport.accessRightsLeaderHelp')"
                >
                  ?
                </button>
              </template>
            </v-tooltip>
          </div>
          <UserSelectInput
            v-model="userId"
            class="access-report__user"
            placeholder="generateReport.selectALeader"
            :clearable="false"
            hide-details="auto"
            :rules="[required($t('generateReport.labelUser'))]"
          />
        </div>

        <div class="access-report__row">
          <div class="access-report__label">
            {{ $t("generateReport.accessRightsSection") }}
          </div>
          <v-input
            :model-value="reportType"
            class="access-report__types"
            :rules="[required($t('generateReport.accessRightsSection'))]"
            hide-details="auto"
          >
            <div class="access-report__options">
              <label
                v-for="option in REPORTS"
                :key="option.id"
                class="access-option"
              >
                <input
                  v-model="reportType"
                  type="radio"
                  name="overseer-access-report"
                  :value="option.id"
                />
                <span>{{ $t(option.nameKey) }}</span>
                <span class="access-option__code">{{ option.code }}</span>
              </label>
            </div>
          </v-input>
        </div>

        <div class="access-report__actions">
          <v-btn
            color="primary"
            type="submit"
            class="access-report__generate"
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
.access-report__card {
  border-color: #d9d9d9;
  background: #fff;
}

.access-report__panel {
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

.access-report__icon {
  display: block;
  flex: 0 0 auto;
}

.access-report__row {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: 12px 24px;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e4e4;
}

.access-report__label-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.access-report__label {
  color: #3a3a3a;
  font-size: 0.875rem;
  line-height: 1.3;
}

.access-report__help {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #1a73c7;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  cursor: help;
}

.access-report__user {
  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.access-report__types {
  :deep(.v-input__control) {
    display: block;
  }

  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.access-report__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.access-option {
  display: grid;
  grid-template-columns: 16px minmax(0, 360px) auto;
  gap: 8px 16px;
  align-items: center;
  min-height: 24px;
  color: #333;
  font-size: 0.875rem;
  line-height: 1.3;
  cursor: pointer;
}

.access-option input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #757575;
  cursor: pointer;
}

.access-option__code {
  color: #1f9d3a;
  white-space: nowrap;
}

.access-report__actions {
  display: flex;
  justify-content: flex-end;
  padding: 28px 16px 16px;
}

.access-report__generate {
  min-width: 118px;
  letter-spacing: 0.04em;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 3px;
}

@media (max-width: 767px) {
  .access-report__row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .access-option {
    grid-template-columns: 16px minmax(0, 1fr);
  }
}
</style>
