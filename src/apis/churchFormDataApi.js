import * as apiClient from './apiClient.js';

const churchFormDataApi = {
    getData() {
        return apiClient.get(`/churches/form-data`);
    }
};

export default churchFormDataApi;