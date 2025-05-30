import apiClient from './apiClient.js';

const GlobalDataApi = {
    getGlobalData() {
        return apiClient.get(`/churches/form-data`);
    }
};

export default GlobalDataApi;