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

  URL.revokeObjectURL(url);
}

/**
 * A failed download still arrives as a Blob, so the JSON error body has to be read
 * back out before it can be shown to the user.
 */
export async function readBlobError(error: unknown): Promise<string | null> {
  const payload = (error as { response?: { data?: unknown } })?.response?.data ?? error;
  if (!(payload instanceof Blob)) {
    return (payload as { message?: string })?.message ?? null;
  }

  try {
    const text = await payload.text();
    const parsed = JSON.parse(text);
    return parsed?.message ?? null;
  } catch {
    return null;
  }
}
