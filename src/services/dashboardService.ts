import apiClient from "@/services/apiClient";
import {
  dispatchOverseerAssignmentsStreamLine,
  type OverseerAssignmentsStreamHandlers,
  type OverseerAssignmentsStreamResult,
} from "@/types/overseerAssignmentsStream";

function buildApiUrl(path: string): string {
  const base = String(import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
  const p = path.replace(/^\//, "");
  return `${base}/${p}`;
}

export type NdjsonStreamOptions = {
  /** Called as soon as each NDJSON line is parsed (before the stream ends). */
  onItem?: (item: unknown) => void;
};

function emitNdjsonLine(line: string, result: unknown[], onItem?: (item: unknown) => void) {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const item = JSON.parse(trimmed);
    result.push(item);
    onItem?.(item);
  } catch {
    // malformed line
  }
}

async function parseNdjsonStream(res: Response, options?: NdjsonStreamOptions): Promise<unknown[]> {
  if (!res.body) {
    throw new Error("No response body");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const result: unknown[] = [];
  const { onItem } = options ?? {};

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      emitNdjsonLine(line, result, onItem);
    }
  }

  if (buffer.trim()) {
    emitNdjsonLine(buffer, result, onItem);
  }

  return result;
}

async function fetchNdjsonStream(path: string, options?: NdjsonStreamOptions): Promise<unknown[]> {
  const url = buildApiUrl(path);
  const headers: Record<string, string> = {
    Accept: "application/x-ndjson",
  };
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { method: "GET", headers });

  if (!res.ok) {
    if (res.status === 401) {
      import("@/stores/authStore")
        .then(({ useAuthStore }) => {
          try {
            const authStore = useAuthStore();
            authStore.user = null;
            authStore.token = null;
            authStore.permissions = [];
            authStore.returnUrl = null;
          } catch {
            // ignore if pinia isn't ready
          }
        })
        .finally(() => {
          import("@/utils/session").then(({ clearSessionAndGoLogin }) => {
            clearSessionAndGoLogin();
          });
        });
    }

    const text = await res.text();
    let message = text || `Request failed: ${res.status}`;
    try {
      const data = JSON.parse(text) as { message?: string };
      if (data?.message) message = data.message;
    } catch {
      // keep message as raw text
    }
    throw new Error(message);
  }

  return parseNdjsonStream(res, options);
}

export type OverseerAssignmentsStreamOptions = OverseerAssignmentsStreamHandlers;

async function fetchOverseerAssignmentsNdjsonStream(
  path: string,
  options?: OverseerAssignmentsStreamOptions,
): Promise<OverseerAssignmentsStreamResult> {
  const result: OverseerAssignmentsStreamResult = {
    meta: null,
    items: [],
  };

  await fetchNdjsonStream(path, {
    onItem: (line) => {
      dispatchOverseerAssignmentsStreamLine(line, {
        onMeta: (meta) => {
          result.meta = meta;
          options?.onMeta?.(meta);
        },
        onItem: ({ index, item }) => {
          result.items.push(item);
          options?.onItem?.({ index, item });
        },
      });
    },
  });

  return result;
}

export const dashboardService = {
  async getProfile() {
    return await apiClient.get(`/dashboard`);
  },
  async getProfileByChurchId(churchId: any) {
    return await apiClient.get(`/dashboard`, { church_id: churchId });
  },
  async getOverseerChurchCounts() {
    return await apiClient.get(`/dashboard/overseer-church-counts`);
  },
  async getOverseerChurches(params = {}, loading = true) {
    return await apiClient.get(`/dashboard/overseer-assignments/churches`, params, loading);
  },
  async getOverseerIndicators() {
    return await apiClient.get(`dashboard/overseer-indicators`, {}, false);
  },
  async getOverseerAssignmentsMyOverseers(options?: OverseerAssignmentsStreamOptions) {
    return fetchOverseerAssignmentsNdjsonStream("dashboard/overseer-assignments/my-overseers", options);
  },
  async getOverseerAssignmentsMyOverseersNextLevel(options?: OverseerAssignmentsStreamOptions) {
    return fetchOverseerAssignmentsNdjsonStream(
      "dashboard/overseer-assignments/my-overseers-next-level",
      options,
    );
  },
};
