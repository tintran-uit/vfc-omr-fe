import apiClient from '@/services/apiClient';
import { PERIOD_12_MONTHS } from '@/constants/graphConstant';

export const graphService  = {
    async getDataAttendanceGivingPastoralVisit(churchId, period = PERIOD_12_MONTHS) {
        return await apiClient.get(`/graph/churches/${churchId}/attendance-giving-visitor`, {period});
    },
    async getDataGenerationalGraph(churchId) {
        return await apiClient.get(`/churches/${churchId}/generational-graph`);
    },
}