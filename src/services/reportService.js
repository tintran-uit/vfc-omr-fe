import apiClient from '@/services/apiClient';

const ReportService  = {
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
    }
}

export default ReportService;