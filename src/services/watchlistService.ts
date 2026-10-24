import apiClient from "@/services/apiClient";

export type WatchlistChurch = {
  id: number;
  name: string;
  country: string;
  city: string;
  pastor: string;
  isMother: boolean;
  isMsc: boolean;
};

export type Watchlist = {
  id: number;
  name: string;
  sortBy: string;
  churches: WatchlistChurch[];
};

export type WatchlistPayload = {
  name: string;
  church_ids: number[];
  sort_by?: string;
  sortlist?: string;
};

function textOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "name" in value) {
    const name = (value as { name?: unknown }).name;
    return typeof name === "string" ? name : "";
  }
  return "";
}

export function mapWatchlistChurch(raw: Record<string, any>): WatchlistChurch | null {
  const id = Number(raw?.church_id ?? raw?.id);
  if (!Number.isFinite(id)) return null;

  return {
    id,
    name: String(raw?.church_name ?? raw?.name ?? ""),
    country: textOf(raw?.country_name ?? raw?.country),
    city: textOf(raw?.city_name ?? raw?.city),
    pastor: textOf(raw?.pastor_name ?? raw?.pastor),
    isMother: Boolean(raw?.is_mother_church),
    isMsc: Boolean(raw?.is_msc),
  };
}

export function mapWatchlist(raw: Record<string, any>): Watchlist {
  const churches = Array.isArray(raw?.churches) ? raw.churches : [];

  return {
    id: Number(raw?.id),
    name: String(raw?.name ?? ""),
    sortBy: String(raw?.sort_by ?? ""),
    churches: churches
      .map((church: Record<string, any>) => mapWatchlistChurch(church))
      .filter((church): church is WatchlistChurch => church != null),
  };
}

export const watchlistService = {
  async list() {
    const data = await apiClient.get("/watchlists");
    const rows = Array.isArray(data) ? data : [];
    return rows.map((row) => mapWatchlist(row));
  },

  async get(id: number | string) {
    const data = await apiClient.get(`/watchlists/${id}`);
    return mapWatchlist(data ?? {});
  },

  async create(payload: WatchlistPayload) {
    return await apiClient.post("/watchlists", payload);
  },

  async update(id: number | string, payload: WatchlistPayload) {
    return await apiClient.patch(`/watchlists/${id}`, payload);
  },

  async remove(id: number | string) {
    return await apiClient.del(`/watchlists/${id}`);
  },

  async removeChurch(watchlistId: number | string, churchId: number | string) {
    return await apiClient.del(`/watchlists/${watchlistId}/churches/${churchId}`);
  },

  // Body is a list of ids, so this posts to the collection path.
  async addChurches(watchlistId: number | string, churchIds: number[]) {
    return await apiClient.post(`/watchlists/${watchlistId}/churches`, {
      church_ids: churchIds,
    });
  },
};
