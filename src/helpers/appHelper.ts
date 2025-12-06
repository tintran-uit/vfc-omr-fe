export function getLocale(): string {
  return localStorage.getItem('language') || 'en'
}

/**
 * Format tiền tệ theo locale
 * @param value - số tiền
 * @param currency - mã tiền tệ (ví dụ: 'VND', 'USD')
 * @param options - tuỳ chọn Intl.NumberFormat thêm
 * @returns string đã format
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string {
  if (value == null || isNaN(value as number)) return ''

  const locale = getLocale()

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(value)
}

export function formatCompactCurrency(
  value: number,
  currency: string = 'USD'
) {
  if (value == null || isNaN(value as number)) return ''

  const locale = getLocale()

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(
  value: number | null | undefined,
  options?: Intl.NumberFormatOptions
): string {
  if (value == null || isNaN(value as number)) return ''

  const locale = getLocale()
  return new Intl.NumberFormat(locale, options).format(value)
}

export function formatCompactNumber(value: number) {
  if (value == null || isNaN(value as number)) return ''

  const locale = getLocale()

  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}
