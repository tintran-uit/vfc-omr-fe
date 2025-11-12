import apiClient from '@/services/apiClient';

export const churchPlantingProjectionService  = {
    async getList(params = {}) {
      return await apiClient.get(`/church-planting-projections`, params);
    },
    async getListByChurch(churchId, params = {}) {
        const combinedParams = { ...params , church_id: churchId };
        return await apiClient.get(`/church-planting-projections`, combinedParams);
    },
    async getListByChurchWithStep(churchId, params = {}) {
        const combinedParams = { ...params , church_id: churchId, completed_steps: true };
        return await apiClient.get(`/church-planting-projections`, combinedParams);
    },
    async get(id, showLoading = true) {
        return await apiClient.get(`/church-planting-projections/${id}`, null, showLoading);
    },
    async create(jsonData) {
        return await apiClient.post(`/church-planting-projections`, jsonData);
    },
    async update(id, jsonData) {
        return await apiClient.patch(`/church-planting-projections/${id}`, jsonData);
    },
    async del(id) {
        return await apiClient.del(`/church-planting-projections/${id}`);
    },
}