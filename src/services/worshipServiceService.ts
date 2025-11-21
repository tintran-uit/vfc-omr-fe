import apiClient from '@/services/apiClient';

export const worshipServiceService = {
    async getListByChurch(churchId, params = {}) {
        return await apiClient.get(`/worship-services/churches/${churchId}`, params);
      },
      async getById(id) {
        return await apiClient.get(`/worship-services/${id}`);
      },
      async createForChurch(churchId, data) {
        return await apiClient.post(`/worship-services/churches/${churchId}`, data);
      },
      async update(id, data) {
        return await apiClient.patch(`/worship-services/${id}`, data);
      },
      async del(id) {
        return await apiClient.del(`/worship-services/${id}`);
      }
}