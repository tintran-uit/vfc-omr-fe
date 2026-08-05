import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { worshipServiceService } from "@/services/worshipServiceService";

dayjs.extend(customParseFormat);

export type ChurchWorshipService = {
  id: number;
  church_id?: number;
  name: string;
  day_name?: string;
  time?: string;
};

/**
 * Field on church detail when the API embeds worship services.
 * When available, `resolveChurchWorshipServices` uses this and skips the extra fetch.
 */
export const CHURCH_DETAIL_WORSHIP_SERVICES_KEY = "worship_services";

function unwrapWorshipServiceList(response: unknown): ChurchWorshipService[] {
  if (Array.isArray(response)) return response;
  if (response && typeof response === "object" && "data" in response) {
    const data = (response as { data: unknown }).data;
    return Array.isArray(data) ? data : [];
  }
  return [];
}

export function getWorshipServicesFromChurchDetail(
  churchDetail?: Record<string, unknown> | null,
): ChurchWorshipService[] | null {
  if (!churchDetail) return null;

  const services = churchDetail[CHURCH_DETAIL_WORSHIP_SERVICES_KEY];
  if (!Array.isArray(services) || services.length === 0) return null;

  return services as ChurchWorshipService[];
}

/**
 * Resolves worship services for a church detail view.
 * Prefers embedded `worship_services` on church detail; otherwise fetches by church id.
 */
export async function resolveChurchWorshipServices(
  churchId: number,
  churchDetail?: Record<string, unknown> | null,
  showLoading = false,
): Promise<ChurchWorshipService[]> {
  const embedded = getWorshipServicesFromChurchDetail(churchDetail);
  if (embedded) return embedded;

  const response = await worshipServiceService.getListByChurch(churchId, {}, showLoading);
  return unwrapWorshipServiceList(response);
}

export function formatWorshipServiceTime(time?: string): string {
  if (!time) return "";

  const parsed = dayjs(time, ["HH:mm:ss", "HH:mm"], true);
  return parsed.isValid() ? parsed.format("h:mm A") : time;
}

export function formatWorshipServiceSchedule(service: ChurchWorshipService): string {
  const time = formatWorshipServiceTime(service.time);
  return [service.day_name, time].filter(Boolean).join(", ");
}
