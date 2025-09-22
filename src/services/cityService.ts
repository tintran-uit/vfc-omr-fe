import apiClient from '@/services/apiClient';
import { update } from 'lodash';

export const cityService = {
    async getAll() {
        return await apiClient.get(`/towns`);
    },
    async getAllByCountry(countryId) {
        return await apiClient.get(`/towns/country/${countryId}`)
    }
}