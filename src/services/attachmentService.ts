import apiClient from '@/services/apiClient';
import { update } from 'lodash';

export const attachmentService  = {
    async getList(params = {}) {
      return await apiClient.get(`/attachments`, params);
    },
    async getListByChurchId(churchId, params = {}, showLoading = true) {
        const selfParams = { ...params, church_id: churchId };

        return await apiClient.get(`/attachments`, selfParams, showLoading);
    },
    async get(id, showLoading = true) {
        return await apiClient.get(`/attachments/${id}`, null, showLoading);
    },
    async create(churchId, jsonData) {
        const postData = {
            church_id: churchId,
            ...jsonData
        }
        return await apiClient.postFormData(`/attachments`, postData);
    },
    async update(id, jsonData) {
        return await apiClient.patch(`/attachments/${id}`, jsonData);
    },
    async del(id) {
        return await apiClient.del(`/attachments/${id}`);
    },
}