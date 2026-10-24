import apiClient from "@/services/apiClient";

export type EventType = {
  id: number;
  name: string;
  color?: string;
  cell_color?: string;
  meeting_type?: string;
};

export type EventTypePayload = {
  name: string;
  color: string;
  cell_color: string;
  meeting_type: string;
};

export const EVENT_MEETING_TYPES = [
  { value: "attendance", labelKey: "eventType.attendance" },
  { value: "meeting_with", labelKey: "eventType.pastorsList" },
] as const;

export function normalizeMeetingType(value: unknown): string {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw === "meeting_with" || raw === "1-1" || raw === "pastors list") return "meeting_with";
  if (raw === "attendance") return "attendance";
  return raw;
}

export function meetingTypeLabelKey(value: unknown): string {
  const normalized = normalizeMeetingType(value);
  if (normalized === "meeting_with") return "eventType.pastorsList";
  if (normalized === "attendance") return "eventType.attendance";
  return "";
}

export const eventTypesService = {
  async getAll(showLoading = true) {
    // API spec: GET /api/v1/event-types
    // apiClient already prefixes baseURL; we only pass path.
    return await apiClient.get("/event-types", {}, showLoading);
  },
  async get(id: number | string) {
    return await apiClient.get(`/event-types/${id}`);
  },
  async create(payload: EventTypePayload) {
    return await apiClient.post("/event-types", payload);
  },
  async update(id: number | string, payload: EventTypePayload) {
    return await apiClient.patch(`/event-types/${id}`, payload);
  },
  async del(id: number | string) {
    return await apiClient.del(`/event-types/${id}`);
  },
};

