export const SUPPORTED_PAIRS = new Set([
  'USD-BRL', 'EUR-BRL', 'GBP-BRL', 'JPY-BRL', 'CAD-BRL',
  'AUD-BRL', 'CHF-BRL', 'CNY-BRL', 'BTC-BRL', 'ETH-BRL',
]);

export const SUPPORTED_CURRENCIES = new Set(
  [...SUPPORTED_PAIRS].map((pair) => pair.split('-')[0]),
);

export function isSupportedPair(pair: string) {
  return SUPPORTED_PAIRS.has(pair);
}

export function isSupportedCurrency(currency: string) {
  return SUPPORTED_CURRENCIES.has(currency);
}
