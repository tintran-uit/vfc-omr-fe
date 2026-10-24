const FILENAME_STAR = /filename\*=\s*(?:UTF-8'')?"?([^";]+)"?/i;
const FILENAME_PLAIN = /filename=\s*"?([^";]+)"?/i;

/** Reads the download name the API suggests, falling back to the caller's name. */
export function filenameFromResponse(headers: unknown, fallback: string): string {
  const header = (headers as Record<string, string> | undefined)?.["content-disposition"];
  if (!header) return fallback;

  const encoded = header.match(FILENAME_STAR)?.[1];
  if (encoded) {
    try {
      return decodeURIComponent(encoded.trim());
    } catch {
      return encoded.trim();
    }
  }

  return header.match(FILENAME_PLAIN)?.[1]?.trim() || fallback;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function downloadFromUrl(url: string, filename: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed (${response.status})`);
  }

  downloadBlob(await response.blob(), filename);
}

type ReportFileLinks = {
  file_name?: string;
  file_url?: string;
  pdf_url?: string;
};

export type ReportDownloadFormat = "file" | "pdf";

function nameFromUrl(url: string, fallback: string) {
  try {
    const name = decodeURIComponent(new URL(url).pathname.split("/").pop() || "");
    return name || fallback;
  } catch {
    return fallback;
  }
}

function reportLinks(payload: unknown): ReportFileLinks | null {
  if (!payload || typeof payload !== "object") return null;

  const body = payload as { data?: ReportFileLinks };
  const data = body.data && typeof body.data === "object" ? body.data : (payload as ReportFileLinks);
  return data;
}

function pdfFilename(data: ReportFileLinks) {
  const named = data.file_name?.trim();
  if (named) return named.replace(/\.[^.]+$/, ".pdf");
  return nameFromUrl(data.pdf_url || "", "report.pdf");
}

/**
 * file downloads file_url. pdf downloads pdf_url when the caller asked for that format.
 * Reports that have no pdf_url stay on file_url.
 */
export function reportFilesFromPayload(
  payload: unknown,
  format: ReportDownloadFormat = "file",
): { url: string; filename: string }[] | null {
  const data = reportLinks(payload);
  if (!data) return null;

  if (format === "pdf") {
    if (!data.pdf_url) {
      throw new Error("PDF file is not available");
    }

    return [{ url: data.pdf_url, filename: pdfFilename(data) }];
  }

  if (!data.file_url) return null;

  return [
    {
      url: data.file_url,
      filename: data.file_name?.trim() || nameFromUrl(data.file_url, "report"),
    },
  ];
}

function errorText(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value)) {
    const text = value.map((item) => String(item).trim()).filter(Boolean).join("\n");
    return text || null;
  }
  return null;
}

/** Prefers the API detail, then the top-level message. */
export function reportErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const body = payload as { message?: unknown; errors?: { detail?: unknown } };
  return errorText(body.errors?.detail) || errorText(body.message);
}

/**
 * A failed download still arrives as a Blob, so the JSON error body has to be read
 * back out before it can be shown to the user.
 */
export async function readBlobError(error: unknown): Promise<string | null> {
  const payload = (error as { response?: { data?: unknown } })?.response?.data ?? error;
  if (!(payload instanceof Blob)) return reportErrorMessage(payload);

  try {
    return reportErrorMessage(JSON.parse(await payload.text()));
  } catch {
    return null;
  }
}
