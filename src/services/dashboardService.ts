import apiClient from '@/services/apiClient';

export const dashboardService  = {
    async getProfile() {
      return await apiClient.get(`/dashboard`);
    },
    async getProfileByChurchId(churchId: any) {
      return await apiClient.get(`/dashboard`, { church_id: churchId });
    }
}