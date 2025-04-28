import * as apiClient from './apiClient.js';

const AuthApi = {
    auth(username, password) {
        return apiClient.post(
            `/login`,
            {
                username,
                password
            }
        );
    }
};

export default AuthApi;