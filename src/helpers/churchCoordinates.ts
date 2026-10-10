export type ChurchCoordinates = {
  latitude: number;
  longitude: number;
};

export function parseCoordinate(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

export function hasChurchMapLocation(
  church: { latitude?: unknown; longitude?: unknown } | null | undefined,
): boolean {
  return readChurchCoordinates(church) !== null;
}

export function readChurchCoordinates(
  church: { latitude?: unknown; longitude?: unknown } | null | undefined,
): ChurchCoordinates | null {
  const latitude = parseCoordinate(church?.latitude);
  const longitude = parseCoordinate(church?.longitude);
  if (latitude === null || longitude === null) return null;
  return { latitude, longitude };
}

export function formatChurchCoordinates(coordinates: ChurchCoordinates) {
  return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
}
