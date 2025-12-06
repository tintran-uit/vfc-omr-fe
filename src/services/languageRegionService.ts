import apiClient from '@/services/apiClient';

export const languageRegionService = {
    async getAll(params = {}) {
        return await apiClient.get(`/language-regions`, params)
      },
      async getById(id) {
        return await apiClient.get(`/language-regions/${id}`)
      },
      async create(data) {
        return await apiClient.post(`/language-regions`, data)
      },
      async update(id, data) {
        return await apiClient.patch(`/language-regions/${id}`, data)
      },
      async del(id) {
        return await apiClient.del(`/language-regions/${id}`)
      }
}