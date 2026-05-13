import apiClient from "@/services/apiClient";

export interface VisitBulkItem {
  user_id: number;
  church_id: number;
  year: number;
  week_number: number;
  number_of_days: number;
}

export const visitsService = {
  async bulkCreate(items: VisitBulkItem[]) {
    return await apiClient.post("/visits/bulk", items);
  },
};
