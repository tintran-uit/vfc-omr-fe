import apiClient from '@/services/apiClient';

export const churchNetworkService = {
    async getAll(params = {}) {
        return await apiClient.get(`/church-networks`, params);
      },
      async getById(id) {
        return await apiClient.get(`/church-networks/${id}`);
      },
      async create(data) {
        return await apiClient.post(`/church-networks`, data);
      },
      async update(id, data) {
        return await apiClient.patch(`/church-networks/${id}`, data);
      },
      async del(id) {
        return await apiClient.del(`/church-networks/${id}`);
      }
}