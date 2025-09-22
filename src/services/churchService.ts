import apiClient from '@/services/apiClient';
import { update } from 'lodash';

export const churchService  = {
    async getList(params = {}) {
      return await apiClient.get(`/churches`, params);
    },
    async get(id) {
      return await apiClient.get(`/churches/${id}`);
    },
    async create(data) {
      return await apiClient.post(`/churches`, data);
    },
    async update(id, data) {
      return await apiClient.patch(`/churches/${id}`, data);
    },
    async del(id) {
      return await apiClient.del(`/churches/${id}`);
    },
    async getFormData() {
      return await apiClient.get(`/churches/form-data`)
    }
}