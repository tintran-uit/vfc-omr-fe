import apiClient from '@/services/apiClient';
import { update } from 'lodash';

export const churchService  = {
    async getList(params = {}, loading = true) {
      return await apiClient.get(`/churches`, params, loading);
    },
    async getEnabledList(params = {}) {
      const myParams = { ...params, disabled: false };
      return await apiClient.get(`/churches`, myParams);
    },
    async getDisabledList(params = {}) {
      const myParams = { ...params, disabled: true };
      return await apiClient.get(`/churches`, myParams);
    },
    async getListDaughter(parentId, params = {}, showLoading = true) {
      const myParams = { ...params, parent_id: parentId };
      return await apiClient.get(`/churches`, myParams, showLoading);
    },
    async getById(id, showLoading = true) {
      return await apiClient.get(`/churches/${id}`, {}, showLoading);
    },
    async get(id, showLoading = true) {
      return await apiClient.get(`/churches/${id}`, {}, showLoading);
    },
    async create(data) {
      return await apiClient.post(`/churches`, data);
    },
    async createWithNewPastor(data) {
      return await apiClient.post(`/churches/with-user`, data);
    },
    async update(id, data) {
      return await apiClient.patch(`/churches/${id}`, data);
    },
    async del(id) {
      return await apiClient.del(`/churches/${id}`);
    },
    async getFormData() {
      return await apiClient.get(`/churches/form-data`)
    },
    async disable(id, reason = '') {
      return await apiClient.patch(`/churches/${id}/disable`, {
        disabled_reason: reason
      })
    },
    async enable(id) {
      return await apiClient.patch(`/churches/${id}/enable`)
    },
    async getDefaultFormData() {
      return await apiClient.get(`/churches/defaults`)
    }
}