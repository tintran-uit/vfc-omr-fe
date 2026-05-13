import apiClient from "@/services/apiClient";

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
  async getOverseerAssignmentsMyOverseers() {
    return await apiClient.get(`dashboard/overseer-assignments/my-overseers`, {}, false);
  },
  async getOverseerAssignmentsMyOverseersNextLevel() {
    return await apiClient.get(`dashboard/overseer-assignments/my-overseers-next-level`, {}, false);
  }
};
