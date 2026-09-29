import apiClient from "@/services/apiClient";

function unwrapData<T>(resp: unknown): T {
  if (resp && typeof resp === "object" && "data" in resp) {
    return (resp as { data: T }).data;
  }
  return resp as T;
}

export type ResourceFile = {
  id: number;
  resource_id: number;
  filename: string;
  part_no: number;
  format_id: number;
  sort_order: number;
  path: string;
  url: string;
  created?: string;
  modified?: string;
  is_ai_translated?: boolean;
  lang: string;
};

export type ResourceNode = {
  id: number;
  parent_id: number | null;
  name: string;
  short_description?: string | null;
  graphic_path?: string;
  available_languages?: string[];
  sort_order?: number;
};

export type ResourceDetail = ResourceNode & {
  files?: ResourceFile[];
  children?: ResourceNode[];
};

type ListParams = {
  name?: string;
  root_only?: boolean;
  parent_id?: number | string;
};

function cleanParams(params: ListParams) {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    out[k] = v as string | number | boolean;
  }
  return out;
}

function bySortOrder(a: ResourceNode, b: ResourceNode) {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name);
}

export const resourceService = {
  /**
   * The trailing slash is required: `/resources` answers with a 301 that carries no
   * CORS headers, so the browser blocks it before the redirect is followed.
   */
  async list(params: ListParams = {}, showLoading = true) {
    const raw = await apiClient.get("/resources/", cleanParams(params), showLoading);
    const data = unwrapData<ResourceNode[]>(raw);
    return Array.isArray(data) ? [...data].sort(bySortOrder) : [];
  },

  async listRoot(name?: string, showLoading = true) {
    return await this.list({ root_only: true, name }, showLoading);
  },

  async listChildren(parentId: number | string, name?: string, showLoading = true) {
    return await this.list({ parent_id: parentId, name }, showLoading);
  },

  async getById(id: number | string, showLoading = true) {
    const raw = await apiClient.get(`/resources/${id}`, {}, showLoading);
    return unwrapData<ResourceDetail>(raw);
  },

  /** Walks up `parent_id` so a folder opened via direct URL still renders its full path. */
  async getAncestors(parentId: number | null | undefined, maxDepth = 10) {
    const trail: ResourceNode[] = [];
    let current = parentId;
    let depth = 0;

    while (current != null && depth < maxDepth) {
      const node = await this.getById(current, false);
      if (!node?.id) break;
      trail.unshift(node);
      current = node.parent_id;
      depth += 1;
    }

    return trail;
  },
};
