import { parseCoordinate } from "@/helpers/churchCoordinates";

export type OmrMapChurch = {
  id: number;
  name: string;
  short_name: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  phone: string;
  email: string;
  attendance: number;
};

export const ATTENDANCE_BANDS = [
  { labelKey: "omrMap.range0", max: 50, color: "rgb(201, 60, 71)" },
  { labelKey: "omrMap.range50", max: 100, color: "rgb(88, 172, 69)" },
  { labelKey: "omrMap.range100", max: 300, color: "rgb(143, 202, 240)" },
  { labelKey: "omrMap.range300", max: 500, color: "rgb(70, 135, 193)" },
  { labelKey: "omrMap.range500", max: 1000, color: "rgb(117, 108, 183)" },
  { labelKey: "omrMap.range1000", max: 3000, color: "rgb(209, 113, 184)" },
  { labelKey: "omrMap.range3000", max: Number.POSITIVE_INFINITY, color: "rgb(209, 224, 21)" },
] as const;

export function readAttendance(value: unknown): number {
  const number = parseCoordinate(value);
  if (number === null || number < 0) return 0;
  return number;
}

export function attendanceColor(attendance: number): string {
  const value = Number.isFinite(attendance) ? Math.max(0, attendance) : 0;
  const band = ATTENDANCE_BANDS.find((item) => value <= item.max);
  return band?.color ?? ATTENDANCE_BANDS[ATTENDANCE_BANDS.length - 1].color;
}

function text(value: unknown): string {
  return value == null ? "" : String(value);
}

function unwrapRows(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const record = payload as { data?: unknown; items?: unknown };
  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.items)) return record.items;
  return [];
}

export function parseOmrMapChurches(payload: unknown): OmrMapChurch[] {
  const churches: OmrMapChurch[] = [];

  for (const row of unwrapRows(payload)) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    const id = Number(item.id);
    const latitude = parseCoordinate(item.latitude);
    const longitude = parseCoordinate(item.longitude);
    if (!Number.isFinite(id) || latitude === null || longitude === null) continue;

    churches.push({
      id,
      name: text(item.name),
      short_name: text(item.short_name),
      latitude,
      longitude,
      address: text(item.address),
      city: text(item.city),
      phone: text(item.phone),
      email: text(item.email),
      attendance: readAttendance(item.attendance),
    });
  }

  return churches;
}
