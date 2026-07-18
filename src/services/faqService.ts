import apiClient from "@/services/apiClient";

function unwrapData<T>(resp: unknown): T {
  if (resp && typeof resp === "object" && "data" in resp) {
    return (resp as { data: T }).data;
  }
  return resp as T;
}

export type FaqTag = {
  id?: number;
  tag_name: string;
  question_id?: number;
};

export type Faq = {
  id: number;
  question_header: string;
  answer: string;
  language_id: number;
  created_at?: string;
  modified_at?: string;
  tags?: FaqTag[];
};

export type FaqPayload = {
  question_header: string;
  answer: string;
  language_id: number;
  tags: { tag_name: string }[];
};

function cleanParams(params: Record<string, string | number | undefined | null>) {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    out[k] = v as string | number;
  }
  return out;
}

export const faqService = {
  async list(params: Record<string, string | number | undefined | null> = {}) {
    const raw = await apiClient.get(`/faqs`, cleanParams(params));
    const data = unwrapData<Faq[]>(raw);
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string | number) {
    const raw = await apiClient.get(`/faqs/${id}`, {}, false);
    return unwrapData<Faq>(raw) as Faq;
  },

  async create(body: FaqPayload) {
    return await apiClient.post(`/faqs`, body);
  },

  async update(id: string | number, body: FaqPayload) {
    return await apiClient.patch(`/faqs/${id}`, body);
  },

  async del(id: string | number) {
    return await apiClient.del(`/faqs/${id}`);
  },
};
