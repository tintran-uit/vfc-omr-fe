import apiClient from "@/services/apiClient";

export type EventType = {
  id: number;
  name: string;
  color?: string;
  cell_color?: string;
  meeting_type?: string;
};

export const eventTypesService = {
  async getAll(showLoading = true) {
    // API spec: GET /api/v1/event-types
    // apiClient already prefixes baseURL; we only pass path.
    return await apiClient.get("/event-types", {}, showLoading);
  },
};

