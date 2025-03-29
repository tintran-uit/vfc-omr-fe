import apiClient from './apiClient.js';

const UserApi = {
    getUser(id) {
        return apiClient.get(`/users/${id}`);
    }
};

export default UserApi;