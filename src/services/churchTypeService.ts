import apiClient from '@/services/apiClient';

export const churchTypeService = {
    async getAll(params = {}) {
        return await apiClient.get(`/church-types`, params);
      },
      async getById(id) {
        return await apiClient.get(`/church-types/${id}`);
      },
      async create(data) {
        return await apiClient.post(`/church-types`, data);
      },
      async update(id, data) {
        return await apiClient.patch(`/church-types/${id}`, data);
      },
      async del(id) {
        return await apiClient.del(`/church-types/${id}`);
      }
}