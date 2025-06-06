import * as apiClient from './apiClient.js';

const globalDataApi = {
    getGlobalData() {
        return apiClient.get(`/churches/form-data`);
    }
};

export default globalDataApi;