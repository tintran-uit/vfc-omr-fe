import apiClient from '@/services/apiClient';

export const churchRegionService = {
    async getAll(params = {}) {
        return await apiClient.get(`/church-regions`, params);
      },
      async getById(id) {
        return await apiClient.get(`/church-regions/${id}`);
      },
      async create(data) {
        return await apiClient.post(`/church-regions`, data);
      },
      async update(id, data) {
        return await apiClient.patch(`/church-regions/${id}`, data);
      },
      async del(id) {
        return await apiClient.del(`/church-regions/${id}`);
      }
}