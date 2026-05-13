import { formatNumber } from '@/helpers/appHelper';

/** Locale-aware grouping for list/print population cells. */
export function displayFormattedPopulation(value: unknown): string {
  if (value == null || value === '') return '';
  const n = typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''));
  if (!Number.isFinite(n)) return '';
  return formatNumber(n);
}

/** Prefer canonical API field; fall back to *_original (e.g. create payload). */
export function displayStartDatePreparation(item: Record<string, unknown> | null | undefined) {
  if (!item) return null;
  return (item.start_date_preparation ?? item.start_date_preparation_original) as
    | string
    | null
    | undefined;
}

export function displayStartDatePioneering(item: Record<string, unknown> | null | undefined) {
  if (!item) return null;
  return (item.start_date_pioneering ?? item.start_date_pioneering_original) as
    | string
    | null
    | undefined;
}
