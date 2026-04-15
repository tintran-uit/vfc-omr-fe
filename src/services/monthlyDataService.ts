import apiClient from "@/services/apiClient";

export const monthlyDataService = {
  async getOne(churchId, year, weekNumber) {
    return await apiClient.get(
      `/weekly-reports/churches/${churchId}?year=${year}&week_number=${weekNumber}`,
    );
  },
  async update(data) {
    return await apiClient.post(`/weekly-reports/batch`, data);
  },
  async getWeekReportStatuses(churchId, year, month) {
    return await apiClient.get(`/week-numbers?church_id=${churchId}&year=${year}&month=${month}`);
  },
};
