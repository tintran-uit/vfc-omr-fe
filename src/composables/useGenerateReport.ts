import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  generateReportService,
  type GenerateReportFormData,
  type ReportEndpointKey,
  type ReportTypeGroups,
} from "@/services/generateReportService";
import { readBlobError } from "@/helpers/fileDownload";

type Option = { id: string; name: string };

/** Report values come back as raw keys, so unlabelled ones degrade to a readable form. */
function humanize(value: string) {
  return value
    .split("_")
    .map((part) => (/^\d+$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(" ");
}

export function useGenerateReport(group: keyof ReportTypeGroups) {
  const { t, te } = useI18n();

  const formData = ref<GenerateReportFormData>({});
  const loadingFormData = ref(false);
  const submitting = ref(false);
  const errorMessage = ref("");

  const reportTypeOptions = computed<Option[]>(() =>
    (formData.value.report_types?.[group] || []).map((value) => {
      const key = `generateReport.types.${value}`;
      return { id: value, name: te(key) ? t(key) : humanize(value) };
    }),
  );

  const loadFormData = async () => {
    loadingFormData.value = true;
    try {
      formData.value = await generateReportService.getFormData();
    } catch (e) {
      console.error("Failed to load report form data:", e);
      errorMessage.value = t("generateReport.loadError");
    } finally {
      loadingFormData.value = false;
    }
  };

  const generate = async (
    endpoint: ReportEndpointKey,
    payload: Record<string, unknown>,
    fallbackFilename: string,
  ) => {
    errorMessage.value = "";
    submitting.value = true;
    try {
      await generateReportService.generate(endpoint, payload, fallbackFilename);
      return true;
    } catch (e) {
      errorMessage.value = (await readBlobError(e)) || t("generateReport.generateError");
      return false;
    } finally {
      submitting.value = false;
    }
  };

  onMounted(loadFormData);

  return {
    formData,
    loadingFormData,
    submitting,
    errorMessage,
    reportTypeOptions,
    generate,
  };
}

export function yearOptions(back = 15, forward = 1): Option[] {
  const current = new Date().getFullYear();
  const years: Option[] = [];

  for (let year = current + forward; year >= current - back; year--) {
    years.push({ id: String(year), name: String(year) });
  }

  return years;
}

export function monthOptions(t: (key: string) => string): Option[] {
  return Array.from({ length: 12 }, (_, index) => ({
    id: String(index + 1),
    name: t(`months.${index + 1}`),
  }));
}
