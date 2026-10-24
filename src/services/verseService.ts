import apiClient from "@/services/apiClient";

export type Verse = {
  verse_heading: string;
  verse_body: string;
};

export const verseService = {
  async show(showLoading = true): Promise<Verse> {
    return await apiClient.get("/verses/show", {}, showLoading);
  },
  async change(payload: Verse): Promise<Verse> {
    return await apiClient.put("/verses/change", payload);
  },
};
