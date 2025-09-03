/**
 * Formate un nombre en devise euros
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formate un nombre en pourcentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Formate un nombre avec des séparateurs de milliers
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}

/**
 * Parse une chaîne en nombre pour les inputs
 */
export function parseNumber(value: string): number {
  const cleaned = value.replace(/[^\d.-]/g, '');
  return cleaned === '' ? 0 : parseFloat(cleaned);
}
