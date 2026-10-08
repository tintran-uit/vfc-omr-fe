import apiClient from "@/services/apiClient";
import { downloadBlob, filenameFromResponse } from "@/helpers/fileDownload";

export type ReportTypeGroups = {
  church?: string[];
  church_reports_graph_reports?: string[];
  visit_report?: string[];
  church_report_status?: string[];
  multi_church?: string[];
  user_data?: string[];
  user_graph?: string[];
  event?: string[];
  my_directory?: string[];
};

export type GenerateReportFormData = {
  title?: string;
  sub_heading?: string;
  report_types?: ReportTypeGroups;
};

const ENDPOINTS = {
  church: "/generate-reports/church",
  churchGraph: "/generate-reports/church-reports-graph-reports",
  churchReportStatus: "/generate-reports/church-report-status",
  myDirectory: "/generate-reports/my-directory",
  visitReport: "/generate-reports/visit-report",
  userGraph: "/generate-reports/user-graph",
  multiChurch: "/generate-reports/multi-church",
  userData: "/generate-reports/user-data",
  event: "/generate-reports/event",
  uaogSearchLog: "/generate-reports/uaog-public-search-log",
  overseerAccessRights: "/generate-reports/overseer-access-rights",
} as const;

export type ReportEndpointKey = keyof typeof ENDPOINTS;

async function generate(
  endpoint: ReportEndpointKey,
  payload: Record<string, unknown>,
  fallbackFilename: string,
) {
  const response = await apiClient.postDownload(ENDPOINTS[endpoint], payload);
  const filename = filenameFromResponse(response?.headers, fallbackFilename);

  downloadBlob(response.data as Blob, filename);

  return filename;
}

function unwrapFormData(resp: unknown): GenerateReportFormData {
  const body = resp as GenerateReportFormData & { data?: GenerateReportFormData };
  if (body?.report_types) return body;
  if (body?.data?.report_types) return body.data;
  return body?.data ?? body ?? {};
}

let formDataPromise: Promise<GenerateReportFormData> | null = null;

export const generateReportService = {
  async getFormData(): Promise<GenerateReportFormData> {
    if (!formDataPromise) {
      formDataPromise = apiClient
        .get("/generate-reports")
        .then(unwrapFormData)
        .catch((error) => {
          formDataPromise = null;
          throw error;
        });
    }

    return formDataPromise;
  },
  generate,
};
