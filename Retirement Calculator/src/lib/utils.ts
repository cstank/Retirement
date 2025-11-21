export function formatCurrency(amount: number, currency: string = '¥', locale: string = 'zh-CN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency === '¥' ? 'CNY' : 'USD', // Simple mapping
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
