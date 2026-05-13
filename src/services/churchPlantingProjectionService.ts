import apiClient from '@/services/apiClient';

export const churchPlantingProjectionService  = {
    async getList(params = {}) {
      return await apiClient.get(`/church-planting-projections`, params);
    },
    async getListByChurch(churchId, params = {}) {
        const combinedParams = { ...params , church_id: churchId };
        return await apiClient.get(`/church-planting-projections`, combinedParams);
    },
    async getListByChurchWithStep(churchId, params = {}, showLoading = true) {
        const combinedParams = { ...params , church_id: churchId, completed_steps: true };
        return await apiClient.get(`/church-planting-projections`, combinedParams, showLoading);
    },
    async get(id, showLoading = true) {
        return await apiClient.get(`/church-planting-projections/${id}`, null, showLoading);
    },
    async create(jsonData) {
        return await apiClient.post(`/church-planting-projections`, jsonData);
    },
    async update(id, jsonData, showLoading = true) {
        return await apiClient.patch(`/church-planting-projections/${id}`, jsonData, showLoading);
    },
    async getSteps(projectionId, showLoading = true) {
        return await apiClient.get(
            `/church-planting-projections/${projectionId}/steps`,
            {},
            showLoading
        );
    },
    async updateSteps(projectionId, jsonData, showLoading = true) {
        return await apiClient.patch(
            `/church-planting-projections/${projectionId}/steps`,
            jsonData,
            showLoading
        );
    },
    async del(id) {
        return await apiClient.del(`/church-planting-projections/${id}`);
    },
}