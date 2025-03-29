import apiClient from './index';

const ReportApi = {
    async save(id, data) {
        await apiClient.post(`/churches/${id}/weekly-report`);
    },

    async getLastestReportOf(year, lastedFromWeekNumber) {
        try {
            const response = await apiClient.get('/user/profile');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default ReportApi;