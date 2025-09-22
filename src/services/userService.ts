import apiClient from '@/services/apiClient';
import { update } from 'lodash';

export const userService  = {
    async getList(params = {}) {
      return await apiClient.get(`/users`, params);
    },
    async get(id) {
        return await apiClient.get(`/pastors/${id}`);
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
    }
}