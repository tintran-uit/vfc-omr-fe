<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import ReportFormShell from "@/components/reports/ReportFormShell.vue";
import SelectInput from "@/components/input/SelectInput.vue";
import UserSelectInput from "@/components/input/UserSelectInput.vue";
import { useGenerateReport, yearOptions } from "@/composables/useGenerateReport";
import { useAuthStore } from "@/stores/authStore";
import type { ReportEndpointKey } from "@/services/generateReportService";

defineOptions({ name: "GenerateReportEventStyle" });

const route = useRoute();
const { t } = useI18n();
const authStore = useAuthStore();

const { errorMessage, submitting, loadingFormData, generate } = useGenerateReport("event");

const userId = ref<number | null>(authStore.user?.id ?? null);
const endYear = ref<string | null>(String(new Date().getFullYear()));
const years = yearOptions();

const titleKey = computed(
  () => (route.meta.title as string) || "generateReport.eventTitle",
);
const descriptionKey = computed(
  () => (route.meta.descriptionKey as string) || "generateReport.eventDescription",
);
const reportType = computed(() => (route.meta.reportType as string) || "event_report");
const endpoint = computed(
  () => ((route.meta.reportEndpoint as ReportEndpointKey) || "event"),
);

const required = (field: string) => (v: unknown) =>
  (v !== null && v !== undefined && v !== "") || t("validation.required", { field });

watch(
  () => route.name,
  () => {
    userId.value = authStore.user?.id ?? null;
    endYear.value = String(new Date().getFullYear());
  },
);

const onSubmit = async () => {
  await generate(
    endpoint.value,
    {
      user_id: userId.value,
      end_year: Number(endYear.value),
      report_type: reportType.value,
    },
    `${reportType.value}.pdf`,
  );
};
</script>

<template>
  <ReportFormShell
    :title-key="titleKey"
    :description="$t(descriptionKey)"
    :error-message="errorMessage"
    :submitting="submitting"
    :loading="loadingFormData"
    @submit="onSubmit"
  >
    <v-col
      cols="12"
      md="6"
    >
      <UserSelectInput
        v-model="userId"
        :label="'generateReport.labelUser'"
        :rules="[required($t('generateReport.labelUser'))]"
      />
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <SelectInput
        v-model="endYear"
        :items="years"
        item-title="name"
        item-value="id"
        :label="'generateReport.labelEndYear'"
        :rules="[required($t('generateReport.labelEndYear'))]"
      />
    </v-col>
  </ReportFormShell>
</template>
