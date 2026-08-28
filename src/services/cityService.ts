import apiClient from '@/services/apiClient';

export type CityPayload = {
  name: string;
  country_id: number | string;
};

export const cityService = {
  async getAll() {
    return await apiClient.get(`/cities`);
  },
  async getAllByCountry(countryId: number | string) {
    return await apiClient.get(`/cities/country/${countryId}`);
  },
  async create(data: CityPayload) {
    return await apiClient.post(`/cities`, data);
  },
};
