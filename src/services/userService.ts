import apiClient from '@/services/apiClient';

export const userService  = {
    async getList(params = {}) {
      return await apiClient.get(`/users`, params);
    },
    async get(id, showLoading = true) {
        return await apiClient.get(`/users/${id}`, null, showLoading);
    },
    async getById(id, showLoading = true) {
        return await apiClient.get(`/users/${id}`, null, showLoading);
    },
    async getPastorList(params = {}, showLoading = true) {
        return await apiClient.get(`/users/pastors`, params, showLoading);
    },
    async getOverseerList(params = {}, showLoading = true) {
        return await apiClient.get(`/users/overseers`, params, showLoading);
    },
    async create(jsonData) {
        return await apiClient.post(`/users`, jsonData);
    },
    async update(id, jsonData) {
        return await apiClient.patch(`/users/${id}`, jsonData);
    },
    async del(id) {
        return await apiClient.del(`/users/${id}`);
    },
    async getFormData() {
        return await apiClient.get(`/users/form-data`);
    },
    async changePassword(id, data) {
        return await apiClient.post(`/users/${id}/password`, data)
    },
    async changePasswordMe(data) {

    },
    async getRelatedUserListOfChurch(churchId, params = {}, showLoading = true) {
        const combinedParams = { ...params , church_id: churchId };
        return await apiClient.get(`/users`, combinedParams, showLoading);
    }
}