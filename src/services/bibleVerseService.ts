import apiClient from '@/services/apiClient';

export const bibleVerseService  = {
    async get() {
        return await apiClient.get(`/verses/show`);
    },
    async update(jsonData) {
        return await apiClient.put(`/verse/change`, jsonData);
    },
}