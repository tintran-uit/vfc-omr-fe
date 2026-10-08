<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ReportFormShell from "@/components/reports/ReportFormShell.vue";
import { useGenerateReport } from "@/composables/useGenerateReport";
import type { ReportEndpointKey } from "@/services/generateReportService";

defineOptions({ name: "GenerateReportSimpleDownload" });

const route = useRoute();
const { errorMessage, submitting, loadingFormData, generate } = useGenerateReport("event");

const titleKey = computed(
  () => (route.meta.title as string) || "generateReport.generateButton",
);
const descriptionKey = computed(
  () => (route.meta.descriptionKey as string) || "",
);
const endpoint = computed(
  () => (route.meta.reportEndpoint as ReportEndpointKey) || "event",
);
const fallbackFilename = computed(
  () => (route.meta.fallbackFilename as string) || "report.pdf",
);

const onSubmit = async () => {
  await generate(endpoint.value, {}, fallbackFilename.value);
};
</script>

<template>
  <ReportFormShell
    :title-key="titleKey"
    :description="descriptionKey ? $t(descriptionKey) : undefined"
    :error-message="errorMessage"
    :submitting="submitting"
    :loading="loadingFormData"
    @submit="onSubmit"
  />
</template>
