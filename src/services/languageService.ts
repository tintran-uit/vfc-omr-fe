import apiClient from '@/services/apiClient';

export const languageService = {
    async getAll(params = {}) {
        return await apiClient.get(`/languages`, {
            page: 1,
            limit: 100,
            ...params
        });
      },
    async getList(params = {}) {
        return await apiClient.get(`/languages`, params);
      },
      async getById(id) {
        return await apiClient.get(`/languages/${id}`);
      },
      async create(data) {
        return await apiClient.post(`/languages`, data);
      },
      async update(id, data) {
        return await apiClient.patch(`/languages/${id}`, data);
      },
      async del(id) {
        return await apiClient.del(`/languages/${id}`);
      }
}