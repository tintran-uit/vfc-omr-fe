import apiClient from '@/services/apiClient';
import { update } from 'lodash';

export const currencyService = {
    async getAll() {
        return await apiClient.get(`/currencies`);
    },
    async getCurrencyOfChurch(churchId) {
        return await apiClient.get(`/currencies/churches/${churchId}`);
    }
}