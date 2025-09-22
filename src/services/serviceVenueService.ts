import apiClient from '@/services/apiClient';
import { update } from 'lodash';

export const serviceVenueService = {
    async getAll() {
        return await apiClient.get(`/churches/service-venues`);
    },
}