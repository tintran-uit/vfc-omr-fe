import apiClient from '@/services/apiClient';
import { update } from 'lodash';

export const attachmentService  = {
    async getList(params = {}) {
      return await apiClient.get(`/attachments`, params);
    },
    async getListByChurchId(churchId, params = {}) {
        const selfParams = { ...params, church_id: churchId };

        return await apiClient.get(`/attachments`, selfParams);
    },
    async get(id, showLoading = true) {
        return await apiClient.get(`/attachments/${id}`, null, showLoading);
    },
    async create(jsonData) {
        return await apiClient.post(`/attachments`, jsonData);
    },
    async update(id, jsonData) {
        return await apiClient.patch(`/attachments/${id}`, jsonData);
    },
    async del(id) {
        return await apiClient.del(`/attachments/${id}`);
    },
}