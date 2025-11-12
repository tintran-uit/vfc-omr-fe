import apiClient from '@/services/apiClient';

export const geographicalRegionService = {
    async getAll() {
        return await apiClient.get(`/geographical-regions`);
    },
    async getListAncestor(regionId) {
        return await apiClient.get(`/geographical-regions/${regionId}/ancestors`);
    }
}