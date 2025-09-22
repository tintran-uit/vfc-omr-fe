import apiClient from '@/services/apiClient';
import { update } from 'lodash';

export const geographicalRegionService = {
    async getAll() {
        return await apiClient.get(`/geographical-regions`);
    },
}