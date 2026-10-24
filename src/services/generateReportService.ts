import apiClient from "@/services/apiClient";
import {
  downloadBlob,
  downloadFromUrl,
  filenameFromResponse,
  readBlobError,
  reportFilesFromPayload,
  type ReportDownloadFormat,
} from "@/helpers/fileDownload";
import { useMessageStore } from "@/stores/messageStore";

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

async function filesFromDownloadBody(body: unknown, format: ReportDownloadFormat) {
  if (!(body instanceof Blob)) return reportFilesFromPayload(body, format);

  const first = await body.slice(0, 1).text();
  if (first !== "{") return null;

  const parsed = JSON.parse(await body.text()) as { success?: boolean; message?: string };
  if (parsed?.success === false) {
    throw parsed;
  }

  return reportFilesFromPayload(parsed, format);
}

async function generate(
  endpoint: ReportEndpointKey,
  payload: Record<string, unknown>,
  fallbackFilename: string,
  format: ReportDownloadFormat = "file",
) {
  try {
    const response = await apiClient.postDownload(ENDPOINTS[endpoint], payload);
    const files = await filesFromDownloadBody(response?.data, format);

    if (files?.length) {
      for (const file of files) {
        await downloadFromUrl(file.url, file.filename);
      }
      return files[0].filename;
    }

    const filename = filenameFromResponse(response?.headers, fallbackFilename);
    downloadBlob(response.data as Blob, filename);

    return filename;
  } catch (error) {
    useMessageStore().error((await readBlobError(error)) || "Failed to generate report");
    throw error;
  }
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
