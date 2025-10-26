import apiClient from '@/services/apiClient';

export const countryService = {
    async getAll() {
        return await apiClient.get(`/countries`, {
          page: 1,
          limit: 500
        })
      },
      async get(id) {
        return await apiClient.get(`/countries/${id}`);
      },
      async create(data) {
        return await apiClient.post(`/countries`, data);
      },
      async update(id, data) {
        return await apiClient.patch(`/countries/${id}`, data);
      },
      async del(id) {
        return await apiClient.del(`/countries/${id}`);
      }
}