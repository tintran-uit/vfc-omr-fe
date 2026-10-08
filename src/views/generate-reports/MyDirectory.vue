<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useGenerateReport } from "@/composables/useGenerateReport";

defineOptions({ name: "GenerateReportMyDirectory" });

const { t } = useI18n();

const { reportTypeOptions, errorMessage, submitting, loadingFormData, generate } =
  useGenerateReport("my_directory");

const REPORT_CODES: Record<string, string> = {
  name: "[# 23.1]",
  geo: "[# 23.2]",
};

const formRef = ref();
const sortBy = ref<string | null>(null);

const options = computed(() =>
  reportTypeOptions.value.map((option) => ({
    ...option,
    code: REPORT_CODES[option.id] ?? "",
  })),
);

watch(options, (items) => {
  if (sortBy.value && !items.some((option) => option.id === sortBy.value)) {
    sortBy.value = null;
  }
});

const required = (field: string) => (v: unknown) =>
  (v !== null && v !== undefined && v !== "") || t("validation.required", { field });

const onSubmit = async () => {
  const { valid } = (await formRef.value?.validate()) ?? { valid: true };
  if (!valid || !sortBy.value) return;

  await generate("myDirectory", { sort_by: sortBy.value }, `my-directory-${sortBy.value}.pdf`);
};
</script>

<template>
  <div class="directory-report">
    <div class="directory-report__banner">
      {{ $t("mainMenu.generateReports") }}
    </div>

    <v-card
      class="directory-report__card"
      variant="outlined"
      rounded="0"
      elevation="0"
    >
      <div class="directory-report__panel">
        <svg
          class="directory-report__icon"
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
        <span>{{ $t("generateReport.myDirectoryTitle") }}</span>
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

        <div class="directory-report__row">
          <div class="directory-report__label">
            {{ $t("generateReport.labelSelectReport") }}
          </div>
          <svg
            class="directory-report__sheet"
            viewBox="0 0 16 16"
            width="18"
            height="18"
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

          <v-input
            :model-value="sortBy"
            class="directory-report__input"
            :rules="[required($t('generateReport.labelSelectReport'))]"
            hide-details="auto"
          >
            <div class="directory-report__options">
              <label
                v-for="option in options"
                :key="option.id"
                class="directory-option"
              >
                <input
                  v-model="sortBy"
                  type="radio"
                  name="directory-report"
                  :value="option.id"
                />
                <span>{{ option.name }}</span>
                <span
                  v-if="option.code"
                  class="directory-option__code"
                >
                  {{ option.code }}
                </span>
              </label>
            </div>
          </v-input>
        </div>

        <p class="directory-report__hint">
          {{ $t("generateReport.myDirectoryHint") }}
        </p>

        <div class="directory-report__actions">
          <v-btn
            color="primary"
            type="submit"
            class="directory-report__generate"
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
.directory-report__banner {
  margin-bottom: 16px;
  padding: 14px 18px;
  background: #3d4b5c;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
}

.directory-report__card {
  border-color: #d9d9d9;
  background: #fff;
}

.directory-report__panel {
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

.directory-report__icon,
.directory-report__sheet {
  display: block;
  flex: 0 0 auto;
}

.directory-report__row {
  display: grid;
  grid-template-columns: 140px 28px minmax(0, 1fr);
  gap: 8px 12px;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e4e4;
}

.directory-report__label {
  padding-top: 2px;
  color: #3a3a3a;
  font-size: 0.875rem;
  line-height: 1.3;
}

.directory-report__sheet {
  margin-top: 2px;
}

.directory-report__input {
  :deep(.v-input__control) {
    display: block;
  }

  :deep(.v-input__details) {
    padding-inline: 0;
  }
}

.directory-report__options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.directory-option {
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  min-height: 24px;
  color: #333;
  font-size: 0.875rem;
  line-height: 1.3;
  cursor: pointer;
}

.directory-option input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #757575;
  cursor: pointer;
}

.directory-option__code {
  color: #1f9d3a;
  font-size: 0.875rem;
  white-space: nowrap;
}

.directory-report__hint {
  margin: 0;
  padding: 16px;
  border-bottom: 1px solid #e4e4e4;
  color: #1f9d3a;
  font-size: 0.875rem;
  line-height: 1.45;
}

.directory-report__actions {
  display: flex;
  justify-content: flex-end;
  padding: 28px 16px 16px;
}

.directory-report__generate {
  min-width: 118px;
  letter-spacing: 0.04em;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 3px;
}

@media (max-width: 767px) {
  .directory-report__row {
    grid-template-columns: 1fr;
  }

  .directory-report__sheet {
    display: none;
  }
}
</style>
