import apiClient from "@/services/apiClient";

export interface EventBulkItem {
  name: string;
  event_type_id: number;
  user_id: number;
  attendance?: number;
  country_id: number;
  week_number: number;
  number_of_days: number;
  year: number;
  meeting_with?: number;
}

export const eventsService = {
  async bulkCreate(items: EventBulkItem[]) {
    return await apiClient.post("/events/bulk", items);
  },
};

