import apiClient from '@/services/apiClient';

function unwrapList(response) {
  if (Array.isArray(response)) return response;
  if (response && typeof response === 'object' && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
}

export const worshipServiceService = {
    async getListByChurch(churchId, params = {}, showLoading = true) {
        const response = await apiClient.get(`/worship-services/churches/${churchId}`, params, showLoading);
        return unwrapList(response);
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