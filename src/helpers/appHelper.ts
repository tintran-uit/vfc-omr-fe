export function getLocale(): string {
  return localStorage.getItem('language') || 'en-US'
}

/**
 * Format tiền tệ theo locale
 * @param value - số tiền
 * @param currency - mã tiền tệ (ví dụ: 'VND', 'USD')
 * @param options - tuỳ chọn Intl.NumberFormat thêm
 * @returns string đã format
 */
export function formatCurrency(
  value: number,
  currency: string = 'VND',
  options?: Intl.NumberFormatOptions
): string {
  const locale = getLocale()

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(value)
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  const locale = getLocale()
  return new Intl.NumberFormat(locale, options).format(value)
}