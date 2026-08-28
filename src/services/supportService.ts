import apiClient from "@/services/apiClient";

export type SupportPayload = {
  name: string;
  email?: string;
  subject: string;
  message: string;
};

export const supportService = {
  async submit(payload: SupportPayload) {
    return await apiClient.post("/support", payload);
  },
};
