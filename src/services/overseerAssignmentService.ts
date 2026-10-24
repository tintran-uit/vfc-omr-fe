import apiClient from "@/services/apiClient";

export type AssignmentType =
  | "church_network"
  | "language_region"
  | "geographical_region"
  | "church_region"
  | "overseer"
  | "church";

export type ExclusionType = "geographical_region" | "church_region";

export type AssignmentPayload = {
  assignment_type: AssignmentType;
  entity_ids: number[];
  sort_order?: number;
};

export const overseerAssignmentService = {
  async get(userId: number | string) {
    return await apiClient.get(`/overseer-assignments/${userId}`);
  },
  async add(userId: number | string, payload: AssignmentPayload) {
    return await apiClient.post(`/overseer-assignments/${userId}`, payload);
  },
  async replace(userId: number | string, payload: AssignmentPayload) {
    return await apiClient.put(`/overseer-assignments/${userId}`, payload);
  },
  async remove(userId: number | string, type: AssignmentType, entityId: number | string) {
    return await apiClient.del(
      `/overseer-assignments/${userId}/assignments/${type}/${entityId}`,
    );
  },
  async addExclusion(
    userId: number | string,
    payload: { exclusion_type: ExclusionType; entity_id: number },
  ) {
    return await apiClient.post(`/overseer-assignments/${userId}/exclusions`, payload);
  },
  async removeExclusion(
    userId: number | string,
    type: ExclusionType,
    entityId: number | string,
  ) {
    return await apiClient.del(
      `/overseer-assignments/${userId}/exclusions/${type}/${entityId}`,
    );
  },
  async sortOverseers(userId: number | string, sortOrders: Record<string, number>) {
    return await apiClient.patch(
      `/overseer-assignments/${userId}/assignments/overseer/sort`,
      { sort_orders: sortOrders },
    );
  },
};
