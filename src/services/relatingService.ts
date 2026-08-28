import apiClient from "@/services/apiClient";

function unwrapData<T>(resp: unknown): T {
  if (resp && typeof resp === "object" && "data" in resp) {
    return (resp as { data: T }).data;
  }
  return resp as T;
}

export type ChurchExistsResult = {
  exists: boolean;
  form_required_message?: string;
  message?: string;
};

export const relatingService = {
  async checkChurchExists(countryId: number | string, cityId: number | string) {
    const raw = await apiClient.get("/relating/church-exists", {
      country_id: countryId,
      city_id: cityId,
    });
    return unwrapData<ChurchExistsResult>(raw);
  },
};
