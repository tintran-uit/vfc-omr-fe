import apiClient from '@/services/apiClient';

export const reportService  = {
    async getReport(churchId, year, weekNumber) {
        
        try {
          const response = await apiClient.get(`/churches/${churchId}/weekly-report?year=${year}&week_number=${weekNumber}`);
          
          return response;
        } catch (error) {
          alert('Error occur');
          throw error;
        }
    },
    async saveReport(churchId, data) {
      try {
        const response = await apiClient.post(`/churches/${churchId}/weekly-report`, data);

        return response;
      } catch (error) {
        alert('Error occur');
        throw error;
      }
    },
    async getLast4WeeksOfChurch(churchId) {
      return await apiClient.get(`/weekly-reports/churches/${churchId}?period=last_4_weeks`);
    }
}