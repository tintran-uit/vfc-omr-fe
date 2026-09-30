import apiClient from '@/services/apiClient';

export const authService  = {
    async login(email, password) {
        try {
            const response = await apiClient.post('/login', { username: email, password });
            
            return response;
        } catch (error) {
            alert('Login failed. Please check your credentials.');
            throw error;
        }
    },
    async getMe() {
        return await apiClient.get(`/users/me`);
    },
    async switchUser(targetUserId: number | string) {
        return await apiClient.post('/auth/switch-user', { target_user_id: Number(targetUserId) });
    }
}
